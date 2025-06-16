
-- Criar tabela para armazenar informações dos clientes
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  entry_number SERIAL UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  house_number TEXT NOT NULL,
  apartment TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  cpf TEXT NOT NULL,
  birth_date DATE NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  order_specification TEXT,
  order_image_url TEXT,
  price NUMERIC,
  payment_method TEXT CHECK (payment_method IN ('avista', 'parcelado')),
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar trigger para atualizar updated_at automaticamente
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Habilitar RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para acesso autenticado
CREATE POLICY "Authenticated users can view all clients" 
  ON public.clients 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert clients" 
  ON public.clients 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update clients" 
  ON public.clients 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete clients" 
  ON public.clients 
  FOR DELETE 
  USING (auth.role() = 'authenticated');
