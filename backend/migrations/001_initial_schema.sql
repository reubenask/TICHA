create table if not exists users (
  id text primary key,
  name text not null,
  email text not null unique,
  level text not null,
  native_language text not null,
  photo_url text,
  password_hash text not null,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists vocabulary_words (
  id text primary key,
  user_id text references users(id) on delete cascade,
  word text not null,
  emoji text not null,
  part_of_speech text not null,
  pronunciation text not null,
  definition text not null,
  example text not null,
  difficulty text not null,
  associations jsonb not null default '[]',
  synonyms jsonb not null default '[]',
  antonyms jsonb not null default '[]',
  translation text not null,
  review_status text not null,
  studied_count integer not null default 0,
  created_at timestamptz,
  updated_at timestamptz
);

create index if not exists vocabulary_words_user_id_idx on vocabulary_words(user_id);

create table if not exists password_reset_tokens (
  token text primary key,
  user_id text not null references users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null
);

create index if not exists password_reset_tokens_user_id_idx on password_reset_tokens(user_id);
create index if not exists password_reset_tokens_expires_at_idx on password_reset_tokens(expires_at);
