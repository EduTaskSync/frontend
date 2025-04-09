import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CustomError } from '@/utils/ErrorClasses';
import { getProjectsSummary, createProject, deleteProject } from '@/hooks/projects/projectQueryUtils';
import { CreateProjectDto, ProjectSummaryListResponse, ProjectSummaryResponse } from './projectInterfaces';

// Define query keys for projects
export const projectQueryKeys = {
  all: ['projects'] as const,
  lists: () => [...projectQueryKeys.all, 'list'] as const,
  groupProjects: (groupId: string) => [...projectQueryKeys.lists(), { groupId }] as const,
  details: () => [...projectQueryKeys.all, 'detail'] as const,
};

// Main hook for projects
export const useProjects = (groupId?: string) => {
  const queryClient = useQueryClient();

  // Fetch projects for a specific group
  const fetchProjectsSummaryResponse = useQuery({
    queryKey: projectQueryKeys.groupProjects(groupId as string),
    queryFn: () => {
      if (!groupId) {
        throw new Error('Group ID is required to fetch projects');
      }
      return getProjectsSummary(groupId);
    },
    // Setting cache management
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!groupId, // Only run if groupId exists
  });

  // Create new project with optimistic updates
  const createProjectResponse = useMutation({
    // Updated to match your API function signature that takes separate params
    mutationFn: (projectData: CreateProjectDto) => {
      if (!groupId) {
        throw new Error('Group ID is required to create a project');
      }
      return createProject(projectData, groupId);
    },

    // Optimistic update handling
    onMutate: async (newProject) => {
      if (!groupId) {
        throw new Error('Group ID is required to create a project');
      }

      const queryKey = projectQueryKeys.groupProjects(groupId);

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousProjects = queryClient.getQueryData<ProjectSummaryListResponse>(queryKey);

      // Create optimistic project with properties matching your ProjectSummary interface
      const optimisticProject: ProjectSummaryResponse = {
        projectId: `temp-${Date.now()}`,
        projectName: newProject.projectName,
        deadline: newProject.deadline,
        progress: 0,
      };

      // Update cache with optimistic data - make sure we're using ProjectSummaryListResponse
      queryClient.setQueryData<ProjectSummaryListResponse>(queryKey, (oldData) => {
        if (!oldData) {
          return { projects: [optimisticProject] };
        }
        return {
          projects: [...oldData.projects, optimisticProject],
        };
      });

      return { previousProjects };
    },

    // Error handling
    onError: (err, _, context) => {
      if (context?.previousProjects && groupId) {
        queryClient.setQueryData(projectQueryKeys.groupProjects(groupId), context.previousProjects);
      }

      console.error('Failed to create project:', err);

      let errorMessage = 'Please try again later.';
      let title = 'Error';

      if (err instanceof CustomError) {
        errorMessage = err.message;
        title = err.title || 'Failed to create project';
      }

      toast.error(title, {
        description: errorMessage,
      });
    },

    // Success handling - add project to cache if needed
    onSuccess: (data) => {
      // Check if we need to update the cache directly instead of just invalidating
      if (groupId) {
        queryClient.setQueryData<ProjectSummaryListResponse>(projectQueryKeys.groupProjects(groupId), (oldData) => {
          // If we don't have cached data, don't try to update it
          if (!oldData) return oldData;

          // Remove the optimistic entry and add the real one
          const filteredProjects = oldData.projects.filter(
            (project) => !project.projectId.toString().startsWith('temp-')
          );

          // Create a properly formatted project from the API response
          const newProject: ProjectSummaryResponse = {
            projectId: data.projectId,
            projectName: data.projectName,
            deadline: data.deadline,
            progress: 0,
          };

          return {
            ...oldData,
            projects: [...filteredProjects, newProject],
          };
        });
      }

      toast.success('Project created successfully', {
        description: `"${data.projectName}" has been created.`,
      });
    },

    // Refetch if needed for consistency
    onSettled: () => {
      if (groupId) {
        queryClient.invalidateQueries({
          queryKey: projectQueryKeys.groupProjects(groupId),
        });
      }
    },
  });

  const deleteProjectResponse = useMutation({
<<<<<<< HEAD
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
=======
    mutationFn: (projectId: string) => {
      return deleteProject(projectId);
    },

    // Optimistic update handling
    onMutate: async (projectId) => {
      if (!groupId) {
        throw new Error('Group ID is required to delete a project');
      }

      const queryKey = projectQueryKeys.groupProjects(groupId);

      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous data
      const previousProjects = queryClient.getQueryData<ProjectSummaryListResponse>(queryKey);

      // Store the project being deleted for display in toast
      const projectToDelete = previousProjects?.projects.find((project) => project.projectId === projectId);

      // Optimistically remove the project from cache
      queryClient.setQueryData<ProjectSummaryListResponse>(queryKey, (oldData) => {
        if (!oldData) return { projects: [] };

        return {
          ...oldData,
          projects: oldData.projects.filter((project) => project.projectId !== projectId),
        };
      });

      return { previousProjects, projectToDelete };
    },

    // Error handling
    onError: (err, _projectId, context) => {
      // Restore previous data on error
      if (context?.previousProjects && groupId) {
        queryClient.setQueryData(projectQueryKeys.groupProjects(groupId), context.previousProjects);
>>>>>>> origin/main
      }

      console.error('Failed to delete project:', err);

<<<<<<< HEAD
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
=======
      let errorMessage = 'Please try again later.';
      let title = 'Delete Failed';

      if (err instanceof CustomError) {
        errorMessage = err.message;
        title = err.title || 'Failed to delete project';
      }

      toast.error(title, {
>>>>>>> origin/main
        description: errorMessage,
      });
    },

<<<<<<< HEAD
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
=======
    // Success handling
    onSuccess: (_, _projectId, context) => {
      const projectName = context?.projectToDelete?.projectName || 'Project';

      toast.success('Project deleted', {
        description: `"${projectName}" has been removed.`,
      });
    },

    // Always refetch after operation to ensure consistency
    onSettled: () => {
      if (groupId) {
        queryClient.invalidateQueries({
          queryKey: projectQueryKeys.groupProjects(groupId),
        });
      }
>>>>>>> origin/main
    },
  });

  return {
<<<<<<< HEAD
    fetchProjectsResponse,
    createProjectResponse,
    deleteProjectResponse,
    getProjectMembersResponse,
    editProjectDetailsResponse,
=======
    fetchProjectsSummaryResponse,
    createProjectResponse,
    deleteProjectResponse,
>>>>>>> origin/main
  };
};
