import { CommandGroup, CommandItem, CommandList, CommandInput } from './ui/command';
import { Command as CommandPrimitive } from 'cmdk';
import { useState, useRef, useCallback, type KeyboardEvent } from 'react';
import { Skeleton } from './ui/skeleton';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Option = Record<'value' | 'label', string> & Record<string, string>;

type AutoCompleteProps = {
  options: Option[];
  emptyMessage: string;
  value?: Option;
  onValueChange?: (value: Option) => void;
  onInputChange?: (value: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

export const AutoComplete = ({
  options,
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  onInputChange,
  disabled,
  isLoading = false,
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option>(value as Option);
  const [inputValue, setInputValue] = useState<string>(value?.label || '');

  // Only show dropdown if input value is 2 or more characters
  const shouldShowDropdown = inputValue.length >= 2;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) return;

      // Only show options if we have 2+ characters
      if (!isOpen && shouldShowDropdown) {
        setOpen(true);
      }

      if (event.key === 'Enter' && input.value !== '') {
        const optionToSelect = options.find((option) => option.label === input.value);
        if (optionToSelect) {
          setSelected(optionToSelect);
          onValueChange?.(optionToSelect);
        }
      }

      if (event.key === 'Escape') {
        input.blur();
      }
    },
    [isOpen, options, onValueChange, shouldShowDropdown]
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
    setInputValue(selected?.label || '');
  }, [selected]);

  // Handle input value changes
  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
      // Call the onInputChange prop if provided
      onInputChange?.(value);
    },
    [onInputChange]
  );

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      setInputValue(selectedOption.label);

      setSelected(selectedOption);
      onValueChange?.(selectedOption);

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onValueChange]
  );

  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div>
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={isLoading || disabled ? undefined : handleInputChange}
          onBlur={handleBlur}
          onFocus={() => shouldShowDropdown && setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="text-base text-foreground" // Add text-foreground class
        />
      </div>
      <div className="relative mt-1">
        <div
          className={cn(
            'animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full rounded-xl bg-popover text-popover-foreground border border-border shadow-md outline-none',
            isOpen && shouldShowDropdown ? 'block' : 'hidden'
          )}
        >
          <CommandList className="rounded-lg max-h-[300px] overflow-y-auto p-2">
            {isLoading ? (
              <CommandPrimitive.Loading>
                <div className="p-1">
                  <Skeleton className="h-8 w-full" />
                </div>
              </CommandPrimitive.Loading>
            ) : null}
            {options.length > 0 && !isLoading ? (
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selected?.value === option.value;
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onSelect={() => handleSelectOption(option)}
                      className={cn(
                        'flex w-full items-center gap-2 px-2 py-1.5 text-sm cursor-default',
                        'hover:bg-accent hover:text-accent-foreground',
                        'data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground',
                        !isSelected ? 'pl-8' : null
                      )}
                    >
                      {isSelected ? <Check className="h-4 w-4 text-primary" /> : null}
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : null}
            {!isLoading ? (
              <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </CommandPrimitive.Empty>
            ) : null}
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  );
};
