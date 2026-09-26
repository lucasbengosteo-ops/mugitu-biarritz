-- Agenda : on n'envoie pas de mail à celui qui agit.
--
-- La spec le disait — « on n'envoie rien quand on se commente soi-même, ni
-- quand un gérant valide son propre vœu » — mais aucune fonction ne le
-- faisait. Lucas, qui est gérant, a reçu huit mails de sa part en accordant
-- ses huit propres créneaux.
--
-- La règle est posée une seule fois, dans la mise en file, plutôt que dans
-- chacune des fonctions appelantes : elle vaut alors pour tous les cas, y
-- compris ceux à venir. Un gérant qui accorde le vœu d'un autre lui écrit
-- toujours — c'est le cas utile ; seul le mail qu'on s'adresse disparaît.

create or replace function public.agenda__mettre_en_file(
  p_type text, p_destinataire uuid, p_sujet text, p_corps text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text;
begin
  -- Personne n'a besoin qu'on lui annonce ce qu'il vient de faire.
  if p_destinataire = auth.uid() then return; end if;

  select u.email into v_email from auth.users u where u.id = p_destinataire;
  if v_email is null then return; end if;
  insert into public.agenda_mails (type, destinataire_email, sujet, corps)
  values (p_type, v_email, p_sujet, p_corps);
end;
$$;

revoke all on function public.agenda__mettre_en_file(text, uuid, text, text) from public, anon, authenticated;
