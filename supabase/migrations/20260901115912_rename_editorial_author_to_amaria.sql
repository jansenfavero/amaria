alter table public.articles
  alter column author set default 'AMARIA';

update public.articles
set author = 'AMARIA'
where author = 'AMAR.IA';
