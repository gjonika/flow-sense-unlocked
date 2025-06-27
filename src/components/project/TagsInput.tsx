
import React, { useState, useRef, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTagSuggestions } from '@/lib/defaultTags';

interface TagsInputProps {
  id?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const TagsInput: React.FC<TagsInputProps> = ({
  id,
  value = [],
  onChange,
  placeholder = 'Add tag...',
  disabled = false,
  className,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = getTagSuggestions(inputValue);
  const filteredSuggestions = suggestions.filter(tag => !value.includes(tag));

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Add tag on Enter or comma
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    }
    // Hide suggestions on Escape
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const addTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().replace(/,/g, '');
    if (normalizedTag && !value.includes(normalizedTag)) {
      setIsAdding(true);
      onChange([...value, normalizedTag]);
      setTimeout(() => setIsAdding(false), 200);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      if (inputValue.trim()) {
        addTag(inputValue.trim());
      }
      setShowSuggestions(false);
    }, 200);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (tag: string) => {
    addTag(tag);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "flex flex-wrap gap-2 p-3 bg-background border rounded-lg focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all duration-200 relative group",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-text",
          className
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map(tag => (
          <Badge 
            key={tag} 
            variant="secondary" 
            className={cn(
              "text-xs px-2 py-1 animate-smooth-fade-in transition-all duration-200 hover:bg-secondary/80",
              isAdding && tag === value[value.length - 1] ? "animate-gentle-scale-in" : ""
            )}
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors duration-150"
              disabled={disabled}
              aria-label={`Remove ${tag} tag`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={value.length === 0 ? placeholder : ""}
          disabled={disabled}
          className="flex-1 min-w-[120px] max-w-full outline-none border-none shadow-none focus-visible:ring-0 p-0 h-6 text-sm bg-transparent"
        />
      </div>
      
      {/* Tag Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="border rounded-lg bg-background shadow-lg max-h-40 overflow-y-auto animate-smooth-fade-in">
          <div className="p-3">
            <div className="text-xs text-muted-foreground mb-2 font-medium flex items-center gap-1">
              <Plus className="h-3 w-3" />
              {inputValue ? 'Suggested tags' : 'Popular tags'}
            </div>
            <div className="flex flex-wrap gap-1">
              {filteredSuggestions.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleSuggestionClick(tag)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded-md transition-all duration-200 hover:scale-105"
                >
                  <Plus className="h-3 w-3" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsInput;
