import { MoreHorizontal, Edit, Trash2, Star, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Item } from '@/types';

interface ItemActionsProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  onToggleImportant?: (id: string, isImportant: boolean) => void;
  onDuplicate?: (item: Item) => void;
}

export function ItemActions({ item, onEdit, onDelete, onToggleImportant, onDuplicate }: ItemActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onEdit(item)}>
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </DropdownMenuItem>
        
        {onToggleImportant && (
          <DropdownMenuItem onClick={() => onToggleImportant(item.id, !item.is_important)}>
            <Star className={`w-4 h-4 mr-2 ${item.is_important ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            {item.is_important ? 'Remover destaque' : 'Marcar importante'}
          </DropdownMenuItem>
        )}
        
        {onDuplicate && (
          <DropdownMenuItem onClick={() => onDuplicate(item)}>
            <Copy className="w-4 h-4 mr-2" />
            Duplicar
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => onDelete(item.id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
