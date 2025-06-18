
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type MaterialRow = Database['public']['Tables']['materials']['Row'];
type MaterialInsert = Database['public']['Tables']['materials']['Insert'];
type MaterialUpdate = Database['public']['Tables']['materials']['Update'];

export interface Material {
  id: string;
  name: string;
  description?: string;
  unit: string;
  current_stock: number;
  minimum_stock: number;
  unit_price?: number;
  supplier?: string;
  created_at: string;
  updated_at: string;
}

export const useMaterials = () => {
  return useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Material[];
    },
  });
};

export const useCreateMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (material: MaterialInsert) => {
      const { data, error } = await supabase
        .from('materials')
        .insert([material])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
};

export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: MaterialUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('materials')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
};

export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
};
