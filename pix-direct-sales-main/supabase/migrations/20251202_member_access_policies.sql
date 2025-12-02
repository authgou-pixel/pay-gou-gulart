DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'modules') THEN
    RAISE NOTICE 'modules table not found';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'lessons') THEN
    RAISE NOTICE 'lessons table not found';
  END IF;
END$$;

ALTER TABLE IF EXISTS public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.lessons ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Owners manage modules' AND polrelid = 'public.modules'::regclass) THEN
    DROP POLICY "Owners manage modules" ON public.modules;
  END IF;
END$$;

CREATE POLICY "Owners manage modules"
  ON public.modules FOR ALL
  USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = modules.product_id AND p.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.products p WHERE p.id = modules.product_id AND p.user_id = auth.uid()));

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Members can view modules' AND polrelid = 'public.modules'::regclass) THEN
    DROP POLICY "Members can view modules" ON public.modules;
  END IF;
END$$;

CREATE POLICY "Members can view modules"
  ON public.modules FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.product_id = modules.product_id
      AND m.status = 'approved'
      AND m.buyer_user_id = auth.uid()
  ));

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Owners manage lessons' AND polrelid = 'public.lessons'::regclass) THEN
    DROP POLICY "Owners manage lessons" ON public.lessons;
  END IF;
END$$;

CREATE POLICY "Owners manage lessons"
  ON public.lessons FOR ALL
  USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = lessons.product_id AND p.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.products p WHERE p.id = lessons.product_id AND p.user_id = auth.uid()));

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Members can view lessons' AND polrelid = 'public.lessons'::regclass) THEN
    DROP POLICY "Members can view lessons" ON public.lessons;
  END IF;
END$$;

CREATE POLICY "Members can view lessons"
  ON public.lessons FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.product_id = lessons.product_id
      AND m.status = 'approved'
      AND m.buyer_user_id = auth.uid()
  ));

-- Optional: default for NOT NULL products.content_url
ALTER TABLE IF EXISTS public.products ALTER COLUMN content_url SET DEFAULT '';
