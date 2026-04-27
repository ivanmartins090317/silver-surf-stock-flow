
-- Criar tabela para controlar estoque de produtos acabados
CREATE TABLE public.product_stock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  current_stock NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id)
);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_product_stock_updated_at
  BEFORE UPDATE ON public.product_stock
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Inserir estoque inicial para produtos existentes
INSERT INTO public.product_stock (product_id, current_stock)
SELECT id, 0 FROM public.products
ON CONFLICT (product_id) DO NOTHING;
