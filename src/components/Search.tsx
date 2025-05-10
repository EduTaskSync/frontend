import React, { forwardRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router';
import { useProjects } from '@/hooks/projects/useProjects';

export interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  defaultValue?: string;
  value?: string;
}

export const Search = forwardRef<HTMLInputElement, SearchProps>(
  ({ className, onSearch, defaultValue, value: propsValue, ...props }, ref) => {
    const [value, setValue] = useState<string>(propsValue?.toString() || defaultValue?.toString() || '');
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const { fetchProjectsSummaryResponse } = useProjects();
    const { data: projectsData } = fetchProjectsSummaryResponse;

    useEffect(() => {
      if (propsValue !== undefined) {
        setValue(propsValue.toString());
      }
    }, [propsValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      setShowDropdown(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch(value);
        setShowDropdown(false);
      }
    };

    const clearSearch = () => {
      setValue('');
      setShowDropdown(false);
      if (onSearch) {
        onSearch('');
      }
    };

    const handleProjectClick = (projectId: string, groupId: string) => {
      navigate(`/app/groups/${groupId}/projects/${projectId}`);
      setShowDropdown(false);
    };

    const filteredProjects =
      projectsData?.projects.filter((project) => project.projectName.toLowerCase().includes(value.toLowerCase())) || [];

    return (
      <div className="relative">
        <div className="relative flex-1">
          <Input
            ref={ref}
            type="search"
            placeholder="Search tasks..."
            className={cn('w-full pl-10 pr-10', className)}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => value && value.length > 0 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            {...props}
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {value && value.length > 0 && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showDropdown && value.trim() && filteredProjects.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
            <div className="py-1">
              {filteredProjects.map((project) => (
                <button
                  key={project.projectId}
                  className="w-full px-4 py-2 text-left hover:bg-accent"
                  onClick={() => handleProjectClick(project.projectId, project.groupId)}
                >
                  {project.projectName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);
