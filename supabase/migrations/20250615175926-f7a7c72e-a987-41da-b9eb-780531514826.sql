
-- Criar enum para unidades de medida
CREATE TYPE public.unit_type AS ENUM ('metros', 'quilogramas', 'litros', 'unidades', 'gramas', 'centimetros');

-- Criar enum para status de produtos
CREATE TYPE public.product_status AS ENUM ('ativo', 'inativo');

-- Criar enum para tipos de movimentação de estoque
CREATE TYPE public.movement_type AS ENUM ('entrada', 'saida', 'ajuste', 'producao');

-- Tabela de materiais/matérias-primas
CREATE TABLE public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  unit unit_type NOT NULL DEFAULT 'unidades',
  current_stock DECIMAL(10,3) NOT NULL DEFAULT 0,
  minimum_stock DECIMAL(10,3) NOT NULL DEFAULT 0,
  unit_price DECIMAL(10,2),
  supplier TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de produtos finais
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  status product_status NOT NULL DEFAULT 'ativo',
  estimated_cost DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de relacionamento produtos x materiais (BOM - Bill of Materials)
CREATE TABLE public.product_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE NOT NULL,
  quantity DECIMAL(10,3) NOT NULL,
  unit unit_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, material_id)
);

-- Tabela de movimentações de estoque
CREATE TABLE public.stock_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE NOT NULL,
  movement_type movement_type NOT NULL,
  quantity DECIMAL(10,3) NOT NULL,
  previous_stock DECIMAL(10,3) NOT NULL,
  new_stock DECIMAL(10,3) NOT NULL,
  reference_id UUID, -- Para referenciar produção ou outras operações
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de alertas do sistema
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE NOT NULL,
  alert_type TEXT NOT NULL DEFAULT 'low_stock',
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security (RLS) em todas as tabelas
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS básicas (permitir tudo por enquanto, será refinado com autenticação)
CREATE POLICY "Allow all operations on materials" ON public.materials FOR ALL USING (true);
CREATE POLICY "Allow all operations on products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow all operations on product_materials" ON public.product_materials FOR ALL USING (true);
CREATE POLICY "Allow all operations on stock_movements" ON public.stock_movements FOR ALL USING (true);
CREATE POLICY "Allow all operations on alerts" ON public.alerts FOR ALL USING (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER handle_materials_updated_at
  BEFORE UPDATE ON public.materials
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Função para criar alertas de estoque baixo
CREATE OR REPLACE FUNCTION public.check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar se o estoque atual está em 10% ou menos do estoque mínimo
  IF NEW.current_stock <= (NEW.minimum_stock * 0.1) AND NEW.current_stock > 0 THEN
    INSERT INTO public.alerts (material_id, message)
    VALUES (
      NEW.id,
      'Material "' || NEW.name || '" com estoque crítico: ' || NEW.current_stock || ' ' || NEW.unit || ' restantes (mínimo: ' || NEW.minimum_stock || ' ' || NEW.unit || ')'
    )
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar estoque baixo
CREATE TRIGGER check_low_stock_trigger
  AFTER UPDATE ON public.materials
  FOR EACH ROW
  WHEN (OLD.current_stock IS DISTINCT FROM NEW.current_stock)
  EXECUTE PROCEDURE public.check_low_stock();

-- Inserir alguns dados de exemplo
INSERT INTO public.materials (name, description, unit, current_stock, minimum_stock, unit_price, supplier) VALUES
('Tecido de Fibra de Vidro', 'Tecido para laminação de pranchas', 'metros', 50.0, 20.0, 15.50, 'Fornecedor A'),
('Resina Poliéster', 'Resina para laminação', 'quilogramas', 25.0, 50.0, 12.80, 'Fornecedor B'),
('Espuma de PU', 'Espuma de poliuretano para miolo da prancha', 'unidades', 10.0, 15.0, 45.00, 'Fornecedor C'),
('Quilhas', 'Quilhas FCS II', 'unidades', 30.0, 20.0, 25.00, 'Fornecedor D'),
('Leash Plug', 'Plug para leash', 'unidades', 50.0, 30.0, 3.50, 'Fornecedor E');

INSERT INTO public.products (name, description, category, status) VALUES
('Prancha Shortboard 6.0', 'Prancha shortboard para surfistas intermediários', 'Shortboard', 'ativo'),
('Prancha Longboard 9.0', 'Prancha longboard clássica', 'Longboard', 'ativo'),
('Prancha Fish 5.8', 'Prancha fish para ondas pequenas', 'Fish', 'ativo');

-- Adicionar composição para Prancha Shortboard 6.0
INSERT INTO public.product_materials (product_id, material_id, quantity, unit) VALUES
((SELECT id FROM public.products WHERE name = 'Prancha Shortboard 6.0'),
 (SELECT id FROM public.materials WHERE name = 'Tecido de Fibra de Vidro'), 2.0, 'metros'),
((SELECT id FROM public.products WHERE name = 'Prancha Shortboard 6.0'),
 (SELECT id FROM public.materials WHERE name = 'Resina Poliéster'), 1.0, 'quilogramas'),
((SELECT id FROM public.products WHERE name = 'Prancha Shortboard 6.0'),
 (SELECT id FROM public.materials WHERE name = 'Espuma de PU'), 1.0, 'unidades'),
((SELECT id FROM public.products WHERE name = 'Prancha Shortboard 6.0'),
 (SELECT id FROM public.materials WHERE name = 'Quilhas'), 3.0, 'unidades'),
((SELECT id FROM public.products WHERE name = 'Prancha Shortboard 6.0'),
 (SELECT id FROM public.materials WHERE name = 'Leash Plug'), 1.0, 'unidades');
