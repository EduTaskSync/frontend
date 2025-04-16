import { GroupCard } from './GroupCard';
import { useGroups } from '@/hooks/groups/useGroups';
import { CardSkeleton } from '../CardSkeleton';
import { CustomError } from '@/utils/ErrorClasses';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, Eye, EyeOff, Filter, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GroupsObj } from '@/hooks/groups/groupInterfaces';

// Define sorting options
type SortOption = 'admin-first' | 'alphabetical' | 'newest' | 'oldest';

export const GroupGrid = () => {
  const { fetchGroupsResponse, updateGroupVisibilityResponse } = useGroups();
  const { data, isLoading, isError, error, refetch } = fetchGroupsResponse;
  const [activeTab, setActiveTab] = useState<'visible' | 'hidden'>('visible');
  const [sortOption, setSortOption] = useState<SortOption>('admin-first');

  // Generic sort and filter function
  const sortAndFilterGroups = (groups: GroupsObj[], isHidden: boolean) => {
    // First filter by visibility
    const filteredGroups = groups.filter((group) => group.groupIsHidden === isHidden);

    return filteredGroups.sort((a, b) => {
      switch (sortOption) {
        case 'admin-first':
          // Put admin groups first (assuming role is included in the group object)
          if (a.isRequestUserAdmin && !b.isRequestUserAdmin) return -1;
          if (!a.isRequestUserAdmin && b.isRequestUserAdmin) return 1;
          // If both are admin or both are not, sort alphabetically
          return a.groupName.localeCompare(b.groupName);

        case 'alphabetical':
          return a.groupName.localeCompare(b.groupName);

        case 'newest':
          // Assuming there's a createdAt field, sort from newest to oldest
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

        case 'oldest':
          // Sort from oldest to newest
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

        default:
          return 0;
      }
    });
  };

  // show loading skeletons for the group cards while data is being fetched
  if (isLoading) {
    return <CardSkeleton variant="group" count={6} />;
  }

  // show error message inside the grid if fetch failed
  if (isError) {
    return (
      <div className="w-full p-6 rounded-xl border border-destructive/20 bg-destructive/5 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h4 className="text-lg font-heading font-semibold text-foreground">
            {error instanceof CustomError ? error.title : 'Failed to load groups'}
          </h4>
          <p className="text-sm text-muted-foreground max-w-md">
            {error instanceof Error ? error.message : 'Please try again later.'}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 border-destructive/20 hover:bg-destructive/10 gap-2"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // if no groups exist, display welcome message
  if (!data?.groups || data.groups.length === 0) {
    return (
      <div className="p-8 text-center rounded-lg border border-border">
        <h3 className="text-xl font-heading font-semibold mb-2">No groups yet</h3>
        <p className="text-muted-foreground">
          Create your first group to start organizing projects and collaborating with team members.
        </p>
      </div>
    );
  }

  // Sort and filter groups based on current settings
  const visibleGroups = sortAndFilterGroups(data.groups, false);
  const hiddenGroups = sortAndFilterGroups(data.groups, true);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Tabs
          defaultValue="visible"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'visible' | 'hidden')}
          className="flex-1"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="visible" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Visible Groups
              {visibleGroups.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {visibleGroups.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="hidden" className="flex items-center gap-2">
              <EyeOff className="h-4 w-4" />
              Hidden Groups
              {hiddenGroups.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {hiddenGroups.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Sort
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Sort Groups By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
              <DropdownMenuRadioItem value="admin-first">Admin Groups First</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="alphabetical">Alphabetical</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="oldest">Oldest First</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4">
        {activeTab === 'visible' ? (
          visibleGroups.length === 0 ? (
            <div className="p-8 text-center rounded-lg border border-border">
              <h3 className="text-xl font-heading font-semibold mb-2">No visible groups</h3>
              <p className="text-muted-foreground">
                All your groups are currently hidden. Switch to the Hidden Groups tab to view them.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
              {visibleGroups.map((group) => (
                <GroupCard
                  key={group.groupId}
                  group={group}
                  toggleVisibility={() => {
                    updateGroupVisibilityResponse.mutate({
                      groupId: group.groupId,
                      groupIsHidden: true,
                    });
                  }}
                  isHidden={false}
                />
              ))}
            </div>
          )
        ) : hiddenGroups.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-border">
            <h3 className="text-xl font-heading font-semibold mb-2">No hidden groups</h3>
            <p className="text-muted-foreground">
              You don't have any hidden groups. You can hide groups to organize your dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
            {hiddenGroups.map((group) => (
              <GroupCard
                key={group.groupId}
                group={group}
                toggleVisibility={() => {
                  updateGroupVisibilityResponse.mutate({
                    groupId: group.groupId,
                    groupIsHidden: false,
                  });
                }}
                isHidden={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
