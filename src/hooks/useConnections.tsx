import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Connection } from '@/types';

export function useConnections() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const connectionsQuery = useQuery({
    queryKey: ['connections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('connections')
        .select('*');

      if (error) throw error;
      return data as Connection[];
    },
    enabled: !!user,
  });

  const createConnection = useMutation({
    mutationFn: async ({ source_id, target_id }: { source_id: string; target_id: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('connections')
        .insert({
          user_id: user.id,
          source_id,
          target_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Connection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });

  const deleteConnection = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });

  return {
    connections: connectionsQuery.data || [],
    isLoading: connectionsQuery.isLoading,
    error: connectionsQuery.error,
    createConnection,
    deleteConnection,
  };
}
