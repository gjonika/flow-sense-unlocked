
import React, { useState, useRef, KeyboardEvent, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Plus, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTagSuggestions } from '@/lib/defaultTags';

interface EnhancedTagsInputProps {
  id?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxTags?: number;
}

const EnhancedTagsInput: React.FC<EnhancedTagsInputProps> = ({
  id,
  value = [],
  onChange,
  placeholder = 'Add tag...',
  disabled = false,
  className,
  maxTags = 10,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = getTagSuggestions(inputValue);
  const filteredSuggestions = suggestions.filter(tag => !value.includes(tag));

  const addTag = useCallback((tag: string) => {
    const normalizedTag = tag.toLowerCase().trim().replace(/,/g, '');
    if (normalizedTag && !value.includes(normalizedTag) && value.length < maxTags) {
      onChange([...value, normalizedTag]);
      setInputValue('');
      setShowSuggestions(false);
      setFocusedSuggestionIndex(-1);
    }
  }, [value, onChange, maxTags]);

  const removeTag = useCallback((tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  }, [value, onChange]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (focusedSuggestionIndex >= 0 && filteredSuggestions[focusedSuggestionIndex]) {
          addTag(filteredSuggestions[focusedSuggestionIndex]);
        } else if (inputValue.trim()) {
          addTag(inputValue.trim());
        }
        break;
      
      case ',':
        e.preventDefault();
        if (inputValue.trim()) {
          addTag(inputValue.trim());
        }
        break;
      
      case 'Backspace':
        if (!inputValue && value.length > 0) {
          removeTag(value[value.length - 1]);
        }
        break;
      
      case 'ArrowDown':
        e.preventDefault();
        if (showSuggestions && filteredSuggestions.length > 0) {
          setFocusedSuggestionIndex(
            focusedSuggestionIndex < filteredSuggestions.length - 1 
              ? focusedSuggestionIndex + 1 
              : 0
          );
        }
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        if (showSuggestions && filteredSuggestions.length > 0) {
          setFocusedSuggestionIndex(
            focusedSuggestionIndex > 0 
              ? focusedSuggestionIndex - 1 
              : filteredSuggestions.length - 1
          );
        }
        break;
      
      case 'Escape':
        setShowSuggestions(false);
        setFocusedSuggestionIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay to allow clicking on suggestions
    setTimeout(() => {
      if (inputValue.trim()) {
        addTag(inputValue.trim());
      }
      setShowSuggestions(false);
      setFocusedSuggestionIndex(-1);
    }, 150);
  };

  const isAtMaxTags = value.length >= maxTags;

  return (
    <div className="space-y-2" role="group" aria-labelledby={`${id}-label`}>
      <div
        className={cn(
          "flex flex-wrap gap-2 p-3 bg-background border rounded-lg transition-all duration-200 relative group",
          "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-text",
          isAtMaxTags ? "border-amber-300 bg-amber-50/30" : "",
          className
        )}
        onClick={() => !disabled && inputRef.current?.focus()}
        role="combobox"
        aria-expanded={showSuggestions}
        aria-haspopup="listbox"
        aria-label="Tag input with suggestions"
      >
        {value.map((tag, index) => (
          <Badge 
            key={tag} 
            variant="secondary" 
            className="text-xs px-2 py-1 animate-smooth-fade-in transition-all duration-200 hover:bg-secondary/80 focus-within:ring-1 focus-within:ring-primary"
          >
            <Tag className="h-3 w-3 mr-1" />
            {tag}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="ml-1 h-auto p-0.5 hover:bg-destructive/20 rounded-full transition-colors duration-150"
              disabled={disabled}
              aria-label={`Remove ${tag} tag`}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        
        {!isAtMaxTags && (
          <Input
            ref={inputRef}
            id={id}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={value.length === 0 ? placeholder : ""}
            disabled={disabled}
            className="flex-1 min-w-[120px] max-w-full outline-none border-none shadow-none focus-visible:ring-0 p-0 h-6 text-sm bg-transparent"
            aria-label="Add new tag"
            aria-describedby={`${id}-help`}
          />
        )}
      </div>
      
      {/* Tag limit indicator */}
      {isAtMaxTags && (
        <p className="text-xs text-amber-600 flex items-center gap-1">
          <Tag className="h-3 w-3" />
          Maximum {maxTags} tags reached
        </p>
      )}
      
      {/* Tag Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          className="border rounded-lg bg-background shadow-lg max-h-40 overflow-y-auto animate-smooth-fade-in z-10"
          role="listbox"
          aria-label="Tag suggestions"
        >
          <div className="p-3">
            <div className="text-xs text-muted-foreground mb-2 font-medium flex items-center gap-1">
              <Plus className="h-3 w-3" />
              {inputValue ? 'Suggested tags' : 'Popular tags'}
            </div>
            <div className="flex flex-wrap gap-1">
              {filteredSuggestions.map((tag, index) => (
                <Button
                  key={tag}
                  type="button"
                  variant={index === focusedSuggestionIndex ? "default" : "ghost"}
                  size="sm"
                  onClick={() => addTag(tag)}
                  className={cn(
                    "h-auto text-xs px-2 py-1 transition-all duration-200 hover:scale-105",
                    index === focusedSuggestionIndex && "bg-primary text-primary-foreground"
                  )}
                  role="option"
                  aria-selected={index === focusedSuggestionIndex}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Screen reader help text */}
      <p id={`${id}-help`} className="sr-only">
        Type to add tags. Press Enter or comma to confirm. Use arrow keys to navigate suggestions. Press Backspace to remove the last tag.
      </p>
    </div>
  );
};

export default EnhancedTagsInput;
