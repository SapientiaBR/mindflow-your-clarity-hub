import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { ItemType } from '@/types';

export interface ParentItem {
  id: string;
  type: ItemType;
  content: string;
  title: string | null;
}

export function useParentItems() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['items', 'parents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('id, type, content, title')
        .in('type', ['project', 'idea', 'event'])
        .neq('status', 'completed')
        .order('type')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as ParentItem[];
    },
    enabled: !!user,
  });
}

export function getParentItemsByType(items: ParentItem[]) {
  return {
    projects: items.filter(i => i.type === 'project'),
    ideas: items.filter(i => i.type === 'idea'),
    events: items.filter(i => i.type === 'event'),
  };
}

export function getParentDisplayName(item: ParentItem): string {
  return item.title || item.content.substring(0, 40);
}
