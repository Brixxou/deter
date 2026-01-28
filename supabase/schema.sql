-- ============================================
-- DETER - Fitness Social Tracker
-- Schema SQL pour Supabase
-- ============================================

-- Extension pour générer des UUIDs
create extension if not exists "uuid-ossp";

-- ============================================
-- Table: profiles
-- Informations des utilisateurs
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index pour recherche par email
create index profiles_email_idx on public.profiles (email);

-- RLS (Row Level Security)
alter table public.profiles enable row level security;

create policy "Les profils publics sont visibles par tous"
  on public.profiles for select
  using (true);

create policy "Les utilisateurs peuvent modifier leur propre profil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Les utilisateurs peuvent créer leur profil"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ============================================
-- Table: friendships (AVANT activities et manual_workouts)
-- Relations d'amitié entre utilisateurs
-- ============================================
create table public.friendships (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  friend_id uuid references public.profiles(id) on delete cascade not null,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Contrainte pour éviter les doublons
  unique(user_id, friend_id),
  -- Contrainte pour éviter de s'ajouter soi-même
  check (user_id != friend_id)
);

-- Index
create index friendships_user_id_idx on public.friendships (user_id);
create index friendships_friend_id_idx on public.friendships (friend_id);
create index friendships_status_idx on public.friendships (status);

-- RLS
alter table public.friendships enable row level security;

create policy "Les utilisateurs peuvent voir leurs demandes d'amitié"
  on public.friendships for select
  using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Les utilisateurs peuvent envoyer des demandes d'amitié"
  on public.friendships for insert
  with check (auth.uid() = user_id);

create policy "Les utilisateurs peuvent répondre aux demandes reçues"
  on public.friendships for update
  using (auth.uid() = friend_id);

create policy "Les utilisateurs peuvent supprimer leurs amitiés"
  on public.friendships for delete
  using (auth.uid() = user_id or auth.uid() = friend_id);

-- ============================================
-- Table: strava_connections
-- Connexions OAuth Strava
-- ============================================
create table public.strava_connections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  strava_athlete_id bigint unique not null,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamp with time zone not null,
  scope text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index pour recherche par user_id
create index strava_connections_user_id_idx on public.strava_connections (user_id);

-- RLS
alter table public.strava_connections enable row level security;

create policy "Les utilisateurs peuvent voir leur propre connexion Strava"
  on public.strava_connections for select
  using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent créer leur connexion Strava"
  on public.strava_connections for insert
  with check (auth.uid() = user_id);

create policy "Les utilisateurs peuvent modifier leur connexion Strava"
  on public.strava_connections for update
  using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent supprimer leur connexion Strava"
  on public.strava_connections for delete
  using (auth.uid() = user_id);

-- ============================================
-- Table: activities
-- Activités synchronisées depuis Strava
-- ============================================
create table public.activities (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  strava_id bigint unique,
  name text not null,
  type text not null, -- Run, Ride, Swim, etc.
  sport_type text,
  distance numeric, -- en mètres
  moving_time integer, -- en secondes
  elapsed_time integer, -- en secondes
  total_elevation_gain numeric, -- en mètres
  average_speed numeric, -- en m/s
  max_speed numeric,
  average_heartrate numeric,
  max_heartrate numeric,
  calories integer,
  start_date timestamp with time zone not null,
  start_latlng numeric[],
  end_latlng numeric[],
  summary_polyline text,
  kudos_count integer default 0,
  achievement_count integer default 0,
  source text default 'strava', -- 'strava' ou 'manual'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index pour recherche par user et date
create index activities_user_id_idx on public.activities (user_id);
create index activities_start_date_idx on public.activities (start_date desc);
create index activities_user_date_idx on public.activities (user_id, start_date desc);

-- RLS
alter table public.activities enable row level security;

create policy "Les activités sont visibles par les amis"
  on public.activities for select
  using (
    auth.uid() = user_id 
    or exists (
      select 1 from public.friendships 
      where status = 'accepted' 
      and ((friendships.user_id = auth.uid() and friendships.friend_id = activities.user_id)
        or (friendships.friend_id = auth.uid() and friendships.user_id = activities.user_id))
    )
  );

create policy "Les utilisateurs peuvent créer leurs activités"
  on public.activities for insert
  with check (auth.uid() = user_id);

create policy "Les utilisateurs peuvent modifier leurs activités"
  on public.activities for update
  using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent supprimer leurs activités"
  on public.activities for delete
  using (auth.uid() = user_id);

-- ============================================
-- Table: manual_workouts
-- Séances Basic Fit entrées manuellement
-- ============================================
create table public.manual_workouts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  workout_type text not null, -- 'gym', 'class', 'cardio', 'strength', etc.
  duration integer, -- en minutes
  calories_burned integer,
  notes text,
  exercises jsonb, -- Liste des exercices avec sets/reps
  workout_date timestamp with time zone not null,
  gym_name text default 'Basic Fit',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index
create index manual_workouts_user_id_idx on public.manual_workouts (user_id);
create index manual_workouts_date_idx on public.manual_workouts (workout_date desc);

-- RLS
alter table public.manual_workouts enable row level security;

create policy "Les workouts sont visibles par les amis"
  on public.manual_workouts for select
  using (
    auth.uid() = user_id 
    or exists (
      select 1 from public.friendships 
      where status = 'accepted' 
      and ((friendships.user_id = auth.uid() and friendships.friend_id = manual_workouts.user_id)
        or (friendships.friend_id = auth.uid() and friendships.user_id = manual_workouts.user_id))
    )
  );

create policy "Les utilisateurs peuvent créer leurs workouts"
  on public.manual_workouts for insert
  with check (auth.uid() = user_id);

create policy "Les utilisateurs peuvent modifier leurs workouts"
  on public.manual_workouts for update
  using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent supprimer leurs workouts"
  on public.manual_workouts for delete
  using (auth.uid() = user_id);

-- ============================================
-- Fonction: Créer un profil automatiquement
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger pour créer le profil à l'inscription
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- Fonction: Mettre à jour updated_at
-- ============================================
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers pour updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

create trigger update_strava_connections_updated_at
  before update on public.strava_connections
  for each row execute procedure public.update_updated_at_column();

create trigger update_friendships_updated_at
  before update on public.friendships
  for each row execute procedure public.update_updated_at_column();

-- ============================================
-- Vue: Statistiques utilisateur
-- ============================================
create or replace view public.user_stats as
select 
  p.id as user_id,
  p.full_name,
  p.avatar_url,
  coalesce(count(distinct a.id), 0) as total_activities,
  coalesce(sum(a.distance) / 1000, 0) as total_distance_km,
  coalesce(sum(a.moving_time) / 3600, 0) as total_hours,
  coalesce(sum(a.calories), 0) as total_calories,
  coalesce(count(distinct mw.id), 0) as total_gym_sessions
from public.profiles p
left join public.activities a on a.user_id = p.id
left join public.manual_workouts mw on mw.user_id = p.id
group by p.id, p.full_name, p.avatar_url;
