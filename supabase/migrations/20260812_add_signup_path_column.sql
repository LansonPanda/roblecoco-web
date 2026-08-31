alter table if exists public.stores
add column if not exists signup_path varchar(50);

comment on column public.stores.signup_path is '가입 경로 예: social:kakao, social:naver, manual';