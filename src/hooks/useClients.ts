
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type ClientRow = Database['public']['Tables']['clients']['Row'];
type ClientInsert = Database['public']['Tables']['clients']['Insert'];

export interface Client {
  id: string;
  entry_date: string;
  entry_number: number;
  name: string;
  address: string;
  house_number: string;
  apartment?: string;
  city: string;
  state: string;
  cpf: string;
  birth_date: string;
  phone: string;
  email: string;
  order_specification?: string;
  order_image_url?: string;
  price?: number;
  payment_method?: string;
  observations?: string;
  created_at: string;
  updated_at: string;
}

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      console.log('Fetching clients...');
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('entry_number', { ascending: false });
      
      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }
      
      console.log('Clients fetched:', data);
      return data as Client[];
    },
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (client: Omit<ClientInsert, 'id' | 'created_at' | 'updated_at' | 'entry_number'>) => {
      const { data, error } = await supabase
        .from('clients')
        .insert([client])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useRecentClients = (limit = 5) => {
  return useQuery({
    queryKey: ['clients', 'recent', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as Client[];
    },
  });
};
