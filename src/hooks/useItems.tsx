import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Item, ItemType, ItemStatus, PriorityLevel } from '@/types';

type DatabaseItem = {
  id: string;
  user_id: string;
  type: string;
  content: string;
  title: string | null;
  status: string;
  priority: string | null;
  due_date: string | null;
  parent_id: string | null;
  tags: string[] | null;
  is_important: boolean | null;
  position_x: number | null;
  position_y: number | null;
  created_at: string;
  updated_at: string;
};

const mapDatabaseItem = (item: DatabaseItem): Item => ({
  id: item.id,
  user_id: item.user_id,
  type: item.type as ItemType,
  content: item.content,
  title: item.title ?? undefined,
  status: item.status as ItemStatus,
  priority: (item.priority as PriorityLevel) ?? undefined,
  due_date: item.due_date ?? undefined,
  parent_id: item.parent_id ?? undefined,
  tags: item.tags ?? [],
  is_important: item.is_important ?? false,
  position_x: item.position_x ?? 0,
  position_y: item.position_y ?? 0,
  created_at: item.created_at,
  updated_at: item.updated_at,
});

export function useItems(type?: ItemType) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const itemsQuery = useQuery({
    queryKey: ['items', type],
    queryFn: async () => {
      let query = supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data as DatabaseItem[]).map(mapDatabaseItem);
    },
    enabled: !!user,
  });

  const createItem = useMutation({
    mutationFn: async (newItem: {
      type: ItemType;
      content: string;
      title?: string;
      priority?: PriorityLevel;
      due_date?: string;
      parent_id?: string;
      tags?: string[];
      is_important?: boolean;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('items')
        .insert({
          user_id: user.id,
          type: newItem.type,
          content: newItem.content,
          title: newItem.title,
          priority: newItem.priority,
          due_date: newItem.due_date,
          parent_id: newItem.parent_id,
          tags: newItem.tags || [],
          is_important: newItem.is_important || false,
        })
        .select()
        .single();

      if (error) throw error;
      return mapDatabaseItem(data as DatabaseItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Item> & { id: string }) => {
      const { data, error } = await supabase
        .from('items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapDatabaseItem(data as DatabaseItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  return {
    items: itemsQuery.data || [],
    isLoading: itemsQuery.isLoading,
    error: itemsQuery.error,
    createItem,
    updateItem,
    deleteItem,
  };
}

export function useRecentItems(limit = 10) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['items', 'recent', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data as DatabaseItem[]).map(mapDatabaseItem);
    },
    enabled: !!user,
  });
}

export function useUpcomingTasks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['items', 'upcoming-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('type', 'task')
        .neq('status', 'completed')
        .order('due_date', { ascending: true })
        .limit(5);

      if (error) throw error;
      return (data as DatabaseItem[]).map(mapDatabaseItem);
    },
    enabled: !!user,
  });
}

export function useImportantItems() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['items', 'important'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('is_important', true)
        .neq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return (data as DatabaseItem[]).map(mapDatabaseItem);
    },
    enabled: !!user,
  });
}

export function useGoals() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['items', 'goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('type', 'goal')
        .neq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as DatabaseItem[]).map(mapDatabaseItem);
    },
    enabled: !!user,
  });
}

export function useEvents() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['items', 'events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('type', 'event')
        .order('due_date', { ascending: true });

      if (error) throw error;
      return (data as DatabaseItem[]).map(mapDatabaseItem);
    },
    enabled: !!user,
  });
}
