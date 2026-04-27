
-- Criar tabela para acessórios
CREATE TABLE public.accessories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  reference_code TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  description TEXT,
  initial_quantity NUMERIC NOT NULL DEFAULT 0,
  current_stock NUMERIC NOT NULL DEFAULT 0,
  minimum_stock NUMERIC NOT NULL DEFAULT 0,
  cost_price NUMERIC,
  sale_price NUMERIC,
  stock_location TEXT,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  supplier TEXT,
  supplier_code TEXT,
  expiry_date DATE,
  serial_number TEXT,
  warranty_info TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'disponivel',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER accessories_updated_at
  BEFORE UPDATE ON public.accessories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Criar trigger para verificar estoque baixo
CREATE OR REPLACE FUNCTION public.check_accessory_low_stock()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Verificar se o estoque atual está em 10% ou menos do estoque mínimo
  IF NEW.current_stock <= (NEW.minimum_stock * 0.1) AND NEW.current_stock > 0 THEN
    INSERT INTO public.alerts (material_id, message, alert_type)
    VALUES (
      NEW.id,
      'Acessório "' || NEW.name || '" com estoque crítico: ' || NEW.current_stock || ' unidades restantes (mínimo: ' || NEW.minimum_stock || ' unidades)',
      'low_stock'
    )
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE TRIGGER accessories_low_stock_check
  AFTER UPDATE ON public.accessories
  FOR EACH ROW
  EXECUTE FUNCTION public.check_accessory_low_stock();

-- Criar tabela para movimentações de estoque de acessórios
CREATE TABLE public.accessory_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  accessory_id UUID NOT NULL REFERENCES public.accessories(id),
  movement_type TEXT NOT NULL, -- 'entrada', 'saida', 'ajuste'
  quantity NUMERIC NOT NULL,
  previous_stock NUMERIC NOT NULL,
  new_stock NUMERIC NOT NULL,
  notes TEXT,
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
