-- ==========================================
-- ANALYTICS & REPORTS SETUP
-- Execute este script no SQL Editor do Supabase
-- ==========================================

-- 1. Schema Updates (Tabela orders)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5),
ADD COLUMN IF NOT EXISTS customer_id UUID;

-- Indexes para performance de relatórios
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON public.orders(store_id);

-- 2. RPC: get_sales_report
-- Retorna um JSON complexo com todos os dados necessários para o dashboard de analytics
CREATE OR REPLACE FUNCTION public.get_sales_report(
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  store_id_param UUID
)
RETURNS JSON AS $$
DECLARE
  kpis JSON;
  sales_history JSON;
  category_sales JSON;
  operational_kpis JSON;
  total_sales_period DECIMAL;
BEGIN
  -- KPIs Principais
  SELECT json_build_object(
    'total_revenue', COALESCE(SUM(total_amount), 0),
    'total_orders', COUNT(*),
    'avg_ticket', CASE WHEN COUNT(*) > 0 THEN COALESCE(SUM(total_amount), 0) / COUNT(*) ELSE 0 END,
    'new_customers', COUNT(DISTINCT customer_id)
  ) INTO kpis
  FROM public.orders
  WHERE store_id = store_id_param
    AND created_at >= start_date
    AND created_at <= end_date
    AND status IN ('delivered', 'ready', 'delivering');

  -- Histórico de Vendas (Diário)
  SELECT json_agg(day_data) INTO sales_history
  FROM (
      SELECT 
          to_char(day_series, 'YYYY-MM-DD') as day,
          COALESCE(SUM(o.total_amount), 0) as revenue
      FROM generate_series(start_date, end_date, '1 day'::interval) as day_series
      LEFT JOIN public.orders o 
        ON date_trunc('day', o.created_at) = date_trunc('day', day_series)
        AND o.store_id = store_id_param
        AND o.status IN ('delivered', 'ready', 'delivering')
      GROUP BY day_series
      ORDER BY day_series
  ) as day_data;

  -- Vendas por Categoria (Top 5)
  -- Nota: Idealmente faria join com tabela categories para pegar o nome
  SELECT json_agg(cat_data) INTO category_sales
  FROM (
      SELECT 
          COALESCE(p.name, 'Outros') as category_name, -- Usando nome do produto como placeholder se categoria não tiver join fácil
          SUM(oi.total_price) as total_sales
      FROM public.order_items oi
      JOIN public.orders o ON oi.order_id = o.id
      LEFT JOIN public.products p ON oi.product_id = p.id
      WHERE o.store_id = store_id_param
        AND o.created_at >= start_date
        AND o.created_at <= end_date
        AND o.status IN ('delivered', 'ready', 'delivering')
      GROUP BY p.name -- Agrupando por produto por enquanto, ideal seria category_id -> categories.name
      ORDER BY total_sales DESC
      LIMIT 5
  ) as cat_data;

  -- KPIs Operacionais
  SELECT json_build_object(
    'avg_prep_time', 25, -- Mock fixo por enquanto
    'avg_rating', COALESCE(AVG(rating), 0)
  ) INTO operational_kpis
  FROM public.orders
  WHERE store_id = store_id_param
    AND created_at >= start_date
    AND created_at <= end_date
    AND status = 'delivered';

  RETURN json_build_object(
    'kpis', kpis,
    'sales_history', COALESCE(sales_history, '[]'::json),
    'category_sales', COALESCE(category_sales, '[]'::json),
    'operational_kpis', operational_kpis
  );
END;
$$ LANGUAGE plpgsql;
