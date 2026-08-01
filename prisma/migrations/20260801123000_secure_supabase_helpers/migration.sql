-- Prisma creates this table outside application migrations. Keep it protected
-- when it lives in Supabase's exposed public schema.
ALTER TABLE IF EXISTS "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- Supabase may install this helper in public. It does not need to be callable
-- through the anon or authenticated API roles.
DO $$
BEGIN
  IF to_regprocedure('public.rls_auto_enable()') IS NOT NULL THEN
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
  END IF;
END
$$;
