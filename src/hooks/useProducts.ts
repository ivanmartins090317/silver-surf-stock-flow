
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

export interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  image_url?: string;
  status: string;
  estimated_cost?: number;
  created_at: string;
  updated_at: string;
  current_stock?: number;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching products with stock...');
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_stock!inner (
            current_stock
          )
        `)
        .order('name');
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      console.log('Raw data from supabase:', data);
      
      const mappedProducts = data.map(product => {
        const stockData = Array.isArray(product.product_stock) 
          ? product.product_stock[0] 
          : product.product_stock;
        
        const mappedProduct = {
          ...product,
          current_stock: stockData?.current_stock || 0
        };
        
        console.log('Mapped product:', mappedProduct);
        return mappedProduct;
      }) as Product[];
      
      console.log('Final mapped products:', mappedProducts);
      return mappedProducts;
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (product: ProductInsert) => {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();
      
      if (error) throw error;
      
      // Criar entrada inicial no estoque
      const { error: stockError } = await supabase
        .from('product_stock')
        .insert({
          product_id: data.id,
          current_stock: 0
        });
      
      if (stockError) {
        console.error('Erro ao criar estoque inicial:', stockError);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: ProductUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Primeiro deletar o estoque do produto
      const { error: stockError } = await supabase
        .from('product_stock')
        .delete()
        .eq('product_id', id);
      
      if (stockError) {
        console.error('Erro ao deletar estoque do produto:', stockError);
      }
      
      // Depois deletar o produto
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
