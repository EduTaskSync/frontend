import { MainContent } from '@/components/MainContent';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Users, Calendar, Settings, MessageSquare, PlusCircle } from 'lucide-react';
import { Link } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const GroupDetailPage = () => {
  const isLoading = true; // Eventually you'll determine this with a data fetch

  return (
    <MainContent>
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="gap-1 pl-1">
          <Link to="/app/groups">
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Groups</span>
          </Link>
        </Button>
      </div>

      {/* Group Header */}
      <div className="mb-8">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3 max-w-lg" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl text-purple-400 font-heading font-extrabold">Group Name</h1>
            <p className="text-muted-foreground">Created on: January 1, 2023</p>
          </>
        )}
      </div>

      {/* Group Banner Image */}
      <div className="relative w-full h-40 sm:h-60 mb-8 rounded-xl overflow-hidden">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <img src="/group-icon-1.jpg" alt="Group banner" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Members Section - Horizontal Layout */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-400" />
            <h3 className="font-heading font-semibold text-lg">Members</h3>
          </div>
          {isLoading ? (
            <Skeleton className="h-9 w-24" />
          ) : (
            <Button size="sm" variant="outline" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>Invite</span>
            </Button>
          )}
        </div>

        {/* Horizontally scrollable member list */}
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex space-x-4">
            {isLoading
              ? Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex flex-col items-center space-y-2 w-20">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))
              : Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex flex-col items-center space-y-2 w-20">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={`https://avatar.vercel.sh/user${i}?size=64`} alt={`Member ${i}`} />
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-center truncate w-full">User {i + 1}</span>
                    </div>
                  ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Upcoming Events Section - Horizontal Layout */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            <h3 className="font-heading font-semibold text-lg">Upcoming Events</h3>
          </div>
          {isLoading ? (
            <Skeleton className="h-9 w-24" />
          ) : (
            <Button size="sm" variant="outline" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>Add Event</span>
            </Button>
          )}
        </div>

        {/* Horizontally scrollable event cards */}
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex space-x-4">
            {isLoading
              ? Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="w-72 shrink-0">
                      <div className="border rounded-xl p-4 space-y-3">
                        <Skeleton className="h-5 w-3/4" />
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <Skeleton className="h-4 w-28" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <div className="flex items-center gap-2 mt-3">
                          <Skeleton className="h-7 w-7 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </div>
                  ))
              : Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="w-72 shrink-0">
                      <div className="border rounded-xl p-4 space-y-3 hover:bg-accent/50 transition-colors">
                        <h4 className="font-medium">Event Title</h4>
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Mar 30, 2025 • 10:00 AM</span>
                        </div>
                        <p className="text-sm">Brief description of the event goes here...</p>
                      </div>
                    </div>
                  ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Content Tabs and Main Area */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column - Main content area */}
        <div className="flex-1">
          {/* Navigation Tabs */}
          <div className="border-b mb-6">
            <div className="flex overflow-x-auto gap-2 sm:gap-6 pb-2">
              {['Overview', 'Tasks', 'Meetings', 'Resources', 'Discussion'].map((tab) =>
                isLoading ? (
                  <Skeleton key={tab} className="h-9 w-24" />
                ) : (
                  <Button key={tab} variant="ghost" size="sm" className="font-heading">
                    {tab}
                  </Button>
                )
              )}
            </div>
          </div>

          {/* Main content section */}
          <div className="space-y-6">
            {/* About section */}
            <div className="space-y-4">
              <h2 className="text-xl font-heading font-semibold">About</h2>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : (
                <p>Group description text goes here...</p>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Sidebar */}
        <div className="md:w-80 lg:w-96 space-y-6">
          {/* Quick actions */}
          <div className="rounded-xl border shadow-sm p-4">
            <h3 className="font-heading font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {isLoading ? (
                Array(4)
                  .fill(0)
                  .map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
              ) : (
                <>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Message All</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainContent>
  );
};

export default GroupDetailPage;
