
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Accessory {
  id: string;
  name: string;
  reference_code: string;
  category: string;
  brand?: string;
  model?: string;
  description?: string;
  initial_quantity: number;
  current_stock: number;
  minimum_stock: number;
  cost_price?: number;
  sale_price?: number;
  stock_location?: string;
  entry_date: string;
  supplier?: string;
  supplier_code?: string;
  expiry_date?: string;
  serial_number?: string;
  warranty_info?: string;
  image_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useAccessories() {
  return useQuery({
    queryKey: ['accessories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accessories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Accessory[];
    },
  });
}

export function useCreateAccessory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newAccessory: Omit<Accessory, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('accessories')
        .insert([newAccessory])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessories'] });
      toast({
        title: "Acessório criado",
        description: "O acessório foi cadastrado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao criar acessório",
        description: error.message,
      });
    },
  });
}

export function useUpdateAccessory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Accessory> & { id: string }) => {
      const { data, error } = await supabase
        .from('accessories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessories'] });
      toast({
        title: "Acessório atualizado",
        description: "O acessório foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar acessório",
        description: error.message,
      });
    },
  });
}

export function useDeleteAccessory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('accessories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessories'] });
      toast({
        title: "Acessório deletado",
        description: "O acessório foi removido com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao deletar acessório",
        description: error.message,
      });
    },
  });
}
