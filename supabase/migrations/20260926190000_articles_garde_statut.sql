-- Articles : publier et mettre à la une restent aux gérants — en base.
--
-- Jusqu'ici la restriction n'existait que dans l'écran : la politique de
-- modification laisse le propriétaire écrire toutes les colonnes, statut
-- compris. Même piège que l'agenda : une politique RLS ne restreint pas les
-- colonnes.
--
-- Le propriétaire passe son article de brouillon à « à relire » et retour,
-- et corrige un article déjà publié. Il ne publie pas, ne programme pas, ne
-- met pas à la une.
--
-- Sans session — SQL, script, clé de service —, rien n'est refusé.
--
-- PIÈGE DE L'UPSERT : l'écran enregistre par un upsert. Postgres déclenche
-- alors le « before insert » sur la ligne proposée, PUIS le « before
-- update » si l'article existe. Vu comme une insertion, corriger une coquille
-- dans son article publié ressemblerait à une publication. Une insertion
-- dont le slug existe déjà est donc laissée passer : la mise à jour qui suit
-- tranche, avec l'ancien et le nouveau statut.

create or replace function public.articles__garde_statut()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if auth.uid() is null then return new; end if;
  if coalesce(public.site_est_super_admin(), false) then return new; end if;

  if tg_op = 'INSERT' then
    if exists (select 1 from public.articles a where a.slug = new.slug) then
      return new;
    end if;
    if new.status in ('programme', 'publie') or new.featured then
      raise exception 'ARTICLE_STATUT';
    end if;
    return new;
  end if;

  if new.status in ('programme', 'publie') and old.status is distinct from new.status then
    raise exception 'ARTICLE_STATUT';
  end if;
  if new.featured is distinct from old.featured then
    raise exception 'ARTICLE_STATUT';
  end if;
  return new;
end;
$$;

revoke all on function public.articles__garde_statut() from public, anon, authenticated;

create trigger articles_garde_statut
  before insert or update on public.articles
  for each row execute function public.articles__garde_statut();
