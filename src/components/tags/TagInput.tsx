import { useState, useRef } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TagBadge, TAG_COLORS, TagColor, stringifyTag, parseTag } from './TagBadge';
import { cn } from '@/lib/utils';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagInput({ tags, onChange, placeholder = "Adicionar tag...", className }: TagInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState<TagColor>('blue');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    
    const newTag = stringifyTag(newTagName.trim(), selectedColor);
    if (!tags.includes(newTag)) {
      onChange([...tags, newTag]);
    }
    setNewTagName('');
    setIsOpen(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <TagBadge 
            key={index} 
            tag={tag} 
            onRemove={() => handleRemoveTag(tag)}
            size="md"
          />
        ))}
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 px-2 border-dashed"
            >
              <Plus className="w-4 h-4 mr-1" />
              Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start">
            <div className="space-y-3">
              <Input
                ref={inputRef}
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="h-8"
                autoFocus
              />
              
              <div>
                <p className="text-xs text-muted-foreground mb-2">Cor</p>
                <div className="flex flex-wrap gap-1">
                  {TAG_COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 transition-all",
                        color.bg,
                        selectedColor === color.name 
                          ? "border-white scale-110" 
                          : "border-transparent hover:scale-105"
                      )}
                    />
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleAddTag} 
                size="sm" 
                className="w-full"
                disabled={!newTagName.trim()}
              >
                Adicionar
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
