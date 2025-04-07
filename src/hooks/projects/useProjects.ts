import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CustomError } from '@/utils/ErrorClasses';
import { getProjectsSummary, createProject } from '@/hooks/projects/projectQueryUtils';
import { CreateProjectDto, ProjectSummaryListResponse, ProjectSummaryResponse } from './projectInterfaces';

// Define query keys for projects
export const projectQueryKeys = {
  all: ['projects'] as const,
  lists: () => [...projectQueryKeys.all, 'list'] as const,
  groupProjects: (groupId: string) => [...projectQueryKeys.lists(), { groupId }] as const,
  details: () => [...projectQueryKeys.all, 'detail'] as const,
};

// const deleteProject = async ({ projectId, groupId }: DeleteProjectRequest): Promise<{ success: boolean }> => {
//   try {
//     // Replace with actual API call
//     const response = await fetch(`/api/groups/${groupId}/projects/${projectId}`, {
//       method: 'DELETE',
//     });

//     if (!response.ok) {
//       throw new CustomError('Failed to delete project', 'Network error', response.status);
//     }
//     return { success: true };
//   } catch (error) {
//     console.error('Error deleting project:', error);
//     throw error;
//   }
// };

// const updateProject = async (projectData: UpdateProjectRequest): Promise<Project> => {
//   try {
//     // Replace with actual API call
//     const response = await fetch(`/api/groups/${projectData.groupId}/projects/${projectData.projectId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(projectData),
//     });

//     if (!response.ok) {
//       throw new CustomError('Failed to update project', 'Network error', response.status);
//     }
//     return response.json();
//   } catch (error) {
//     console.error('Error updating project:', error);
//     throw error;
//   }
// };

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

  // // Delete project with optimistic updates
  // const deleteProjectResponse = useMutation({
  //   mutationFn: deleteProject,
  //   onMutate: async (deleteProjectObj) => {
  //     if (!groupId) {
  //       throw new Error('Group ID is required to delete a project');
  //     }

  //     const queryKey = projectQueryKeys.groupProjects(groupId);

  //     // Cancel outgoing refetches
  //     await queryClient.cancelQueries({ queryKey });

  //     // Snapshot previous data
  //     const previousProjects = queryClient.getQueryData<ProjectListResponse>(queryKey);

  //     // Optimistically remove the project from cache
  //     queryClient.setQueryData<ProjectListResponse>(queryKey, (oldData) => {
  //       if (!oldData) return { projects: [] };

  //       return {
  //         projects: oldData.projects.filter((project) => project.projectId !== deleteProjectObj.projectId),
  //       };
  //     });

  //     return { previousProjects };
  //   },

  //   // On error, revert to previous state
  //   onError: (err, variables, context) => {
  //     if (context?.previousProjects && groupId) {
  //       queryClient.setQueryData(projectQueryKeys.groupProjects(groupId), context.previousProjects);
  //     }

  //     console.error('Failed to delete project:', err);

  //     let errorMessage = 'Please try again later.';
  //     let title = 'Error';

  //     if (err instanceof CustomError) {
  //       errorMessage = err.message;
  //       title = err.title || 'Failed to delete project';
  //     }

  //     toast.error(title, {
  //       description: errorMessage,
  //     });
  //   },

  //   // On success
  //   onSuccess: (_, variables) => {
  //     toast.success('Project deleted successfully');
  //   },

  //   // Refetch to synchronize with server
  //   onSettled: () => {
  //     if (groupId) {
  //       queryClient.invalidateQueries({
  //         queryKey: projectQueryKeys.groupProjects(groupId),
  //       });
  //     }
  //   },
  // });

  // // Update project with optimistic updates
  // const updateProjectResponse = useMutation({
  //   mutationFn: updateProject,
  //   onMutate: async (updatedProject) => {
  //     if (!groupId) {
  //       throw new Error('Group ID is required to update a project');
  //     }

  //     const queryKey = projectQueryKeys.groupProjects(groupId);
  //     const detailQueryKey = projectQueryKeys.detail(updatedProject.projectId);

  //     // Cancel outgoing refetches
  //     await queryClient.cancelQueries({ queryKey });
  //     await queryClient.cancelQueries({ queryKey: detailQueryKey });

  //     // Snapshot previous values
  //     const previousProjects = queryClient.getQueryData<ProjectListResponse>(queryKey);
  //     const previousProjectDetail = queryClient.getQueryData(detailQueryKey);

  //     // Update project list cache
  //     queryClient.setQueryData<ProjectListResponse>(queryKey, (oldData) => {
  //       if (!oldData) return { projects: [] };

  //       return {
  //         projects: oldData.projects.map((project) => {
  //           if (project.projectId === updatedProject.projectId) {
  //             return {
  //               ...project,
  //               projectName: updatedProject.projectName || project.projectName,
  //               deadline: updatedProject.deadline?.toISOString() || project.deadline,
  //             };
  //           }
  //           return project;
  //         }),
  //       };
  //     });

  //     // Update project detail cache if it exists
  //     if (previousProjectDetail) {
  //       queryClient.setQueryData(detailQueryKey, (oldData) => {
  //         if (!oldData) return oldData;
  //         return {
  //           ...oldData,
  //           projectName: updatedProject.projectName || (oldData as any).projectName,
  //           deadline: updatedProject.deadline?.toISOString() || (oldData as any).deadline,
  //         };
  //       });
  //     }

  //     return { previousProjects, previousProjectDetail };
  //   },

  //   // On error, revert to previous state
  //   onError: (err, _, context) => {
  //     if (context?.previousProjects && groupId) {
  //       queryClient.setQueryData(projectQueryKeys.groupProjects(groupId), context.previousProjects);
  //     }

  //     if (context?.previousProjectDetail) {
  //       queryClient.setQueryData(projectQueryKeys.detail(_.projectId), context.previousProjectDetail);
  //     }

  //     console.error('Failed to update project:', err);

  //     let errorMessage = 'Please try again later.';
  //     let title = 'Error';

  //     if (err instanceof CustomError) {
  //       errorMessage = err.message;
  //       title = err.title || 'Failed to update project';
  //     }

  //     toast.error(title, {
  //       description: errorMessage,
  //     });
  //   },

  //   // On success
  //   onSuccess: (data) => {
  //     toast.success('Project updated successfully', {
  //       description: `"${data.projectName}" has been updated`,
  //     });
  //   },

  //   // Refetch to synchronize with server
  //   onSettled: (_, __, variables) => {
  //     if (groupId) {
  //       queryClient.invalidateQueries({
  //         queryKey: projectQueryKeys.groupProjects(groupId),
  //       });
  //       queryClient.invalidateQueries({
  //         queryKey: projectQueryKeys.detail(variables.projectId),
  //       });
  //     }
  //   },
  // });

  return {
    fetchProjectsResponse: fetchProjectsSummaryResponse,
    createProjectResponse,
  };
};
