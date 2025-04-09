import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/utils/queryKeyFactory';
import { ProjectListResponse, ProjectsObj } from './projectInterfaces';
import { getAllProjects, createNewProject, deleteProject, getProjectMembers, editProjectDetails } from './projectQueryUtils';
import { toast } from 'sonner';
import axios from 'axios';

// Custom hook that encapsulates all groject-related API operations
export const useProjects = (projectId?: string) => {
  // needed for making certain cached data stale so that they are updated after mutations by targeting their query key
  const queryClient = useQueryClient();

  // fetch user's allocated projects
  const fetchProjectsResponse = useQuery({
    queryKey: queryKeys.projectList(),
    queryFn: getAllProjects,
    // after 10 seconds data will be considered stale and queryFn will be executed again
    // within the staleTime limit, data wont be refreshed even if the window loses focus/component remounts
    staleTime: 5 * 60 * 1000, // 5 mins
    // time fetched data is stored in the cache before being removed
    gcTime: 10 * 60 * 1000, // 10 mins
  });

  const createProjectResponse = useMutation({
    mutationFn: createNewProject,
    // optimistic update, this function will be run before the server response
    onMutate: async (newProject) => {
      const targetQueryKeyArr = queryKeys.projectList();

      // cancel outgoing project fetch requests so that they dont overwrite the optimisitic update
      await queryClient.cancelQueries({ queryKey: targetQueryKeyArr });

      // store a snapshot of the previous data
      const previousProjects = queryClient.getQueryData<ProjectListResponse>(targetQueryKeyArr);

      // create temp optimistic project obj with correct shape
      const optimisticProject: ProjectsObj = {
        projectId: `temp-${Date.now()}`,
        projectName: newProject.projectName,
        projectDescription: newProject.projectDetails,
        projectCreationDate: Date.now().toString(),
        projectMembers: 1,
        imgUrl: newProject.imgUrl,
      };

      // immediately update cached project list
      queryClient.setQueryData<ProjectListResponse>(targetQueryKeyArr, (oldData) => {
        // no cached projects exsits, so add new project in appropriate obj shape
        if (!oldData) {
          return { projects: [optimisticProject] };
        }

        // cached data exists so append new to previous data in an immutable way
        return { projects: [...oldData.projects, optimisticProject] };
      });
      // return previous data if the server responses with error
      // this is passed to the 'context' parameter in OnError
      return { previousProjects };
    },

    // rollback changes if mutation fails
    onError: (err, _, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(queryKeys.projectList(), context.previousProjects);
      }

      console.error('Failed to create groject:', err);

      // specific error messaging based on error type
      let errorMessage = 'Please try again later.';
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
        } else if (err.response.status === 403) {
          errorMessage = "You don't have permission to create projects.";
        }
      }

      toast.error('Failed to create project', {
        description: errorMessage,
      });
    },
    onSettled: () => {
      // refetch after error or success to ensure we always have the correct data
      queryClient.invalidateQueries({ queryKey: queryKeys.projectList() });
    },
    //debugging purposes
    onSuccess: (data) => {
      console.log('Project created successfully:', data);
    },
  });

  const deleteProjectResponse = useMutation({
    mutationFn: deleteProject,

    onMutate: async (deleteProjectObj) => {
      const targetQueryKeyArr = queryKeys.projectList();

      // cancel outgoing groject fetch requests so they don't overwrite the optimistic update
      await queryClient.cancelQueries({ queryKey: targetQueryKeyArr });

      // store a snapshot of the previous data
      const previousProjects = queryClient.getQueryData<ProjectListResponse>(targetQueryKeyArr);

      // immediately update cached project list by filtering out the deleted groject
      queryClient.setQueryData<ProjectListResponse>(targetQueryKeyArr, (oldData) => {
        if (!oldData) return { projects: [] };

        return {
          projects: oldData.projects.filter((project) => project.projectId !== deleteProjectObj.projectId),
        };
      });

      // return previous data if the server responds with error
      return { previousProjects };
    },

    // rollback changes if mutation fails
    onError: (err, _, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(queryKeys.projectList(), context.previousProjects);
      }

      console.error('Failed to delete project:', err);

      // specific error messaging based on error type
      let errorMessage = 'Please try again later.';

      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 400) {
          errorMessage = 'This project has ongoing projects.';
        } else if (err.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
        } else if (err.response.status === 403) {
          errorMessage = "You don't have permission to delete this project.";
        } else if (err.response.status === 404) {
          errorMessage = 'Project not found. It may have been already deleted.';
        }
      }

      toast.error('Failed to delete project', {
        description: errorMessage,
      });
    },

    onSettled: () => {
      // refetch after error or success to ensure we always have the correct data
      queryClient.invalidateQueries({ queryKey: queryKeys.projectList() });
    },

    onSuccess: (data) => {
      toast.success('Project deleted successfully');
      console.log('Project deleted successfully:', data);
    },
  });

  const getProjectMembersResponse = useQuery({
    queryKey: queryKeys.getMembers(projectId as string),
    queryFn: () => {
      if (!projectId) {
        throw new Error('Project ID is required to fetch members');
      }
      return getProjectMembers(projectId);
    },
    staleTime: 5 * 60 * 1000, // 5 mins
    gcTime: 10 * 60 * 1000, // 10 mins
  });

  const editProjectDetailsResponse = useMutation({
    mutationFn: editProjectDetails,
    onError: (err) => {
      console.error('Failed to edit groject:', err);

      // specific error messaging based on error type
      let errorMessage = 'Please try again later.';

      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 400) {
          errorMessage = 'This project cannot be edited.';
        } else if (err.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
        } else if (err.response.status === 403) {
          errorMessage = "You don't have permission to edit this project.";
        } else if (err.response.status === 404) {
          errorMessage = 'Project details not found. Please try again later.';
        }
      }

      toast.error('Failed to edit project', {
        description: errorMessage,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectList() });
    },
  });

  return {
    fetchProjectsResponse,
    createProjectResponse,
    deleteProjectResponse,
    getProjectMembersResponse,
    editProjectDetailsResponse,
  };
};
