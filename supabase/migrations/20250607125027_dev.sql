create table "public"."user_trials" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid default auth.uid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone,
    "trial_expires_at" timestamp with time zone not null,
    "soft_deleted_at" timestamp with time zone,
    "deleted_at" timestamp with time zone
);


alter table "public"."user_trials" enable row level security;

CREATE UNIQUE INDEX user_trials_pkey ON public.user_trials USING btree (id);

alter table "public"."user_trials" add constraint "user_trials_pkey" PRIMARY KEY using index "user_trials_pkey";

alter table "public"."user_trials" add constraint "user_trials_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."user_trials" validate constraint "user_trials_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  
  insert into public.user_trials (user_id, trial_expires_at)
  values (new.id, now() + interval '30 days');
  
  return new;
end;
$function$
;

grant delete on table "public"."user_trials" to "anon";

grant insert on table "public"."user_trials" to "anon";

grant references on table "public"."user_trials" to "anon";

grant select on table "public"."user_trials" to "anon";

grant trigger on table "public"."user_trials" to "anon";

grant truncate on table "public"."user_trials" to "anon";

grant update on table "public"."user_trials" to "anon";

grant delete on table "public"."user_trials" to "authenticated";

grant insert on table "public"."user_trials" to "authenticated";

grant references on table "public"."user_trials" to "authenticated";

grant select on table "public"."user_trials" to "authenticated";

grant trigger on table "public"."user_trials" to "authenticated";

grant truncate on table "public"."user_trials" to "authenticated";

grant update on table "public"."user_trials" to "authenticated";

grant delete on table "public"."user_trials" to "service_role";

grant insert on table "public"."user_trials" to "service_role";

grant references on table "public"."user_trials" to "service_role";

grant select on table "public"."user_trials" to "service_role";

grant trigger on table "public"."user_trials" to "service_role";

grant truncate on table "public"."user_trials" to "service_role";

grant update on table "public"."user_trials" to "service_role";

create policy "Enable users to view their own trial data only"
on "public"."user_trials"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



