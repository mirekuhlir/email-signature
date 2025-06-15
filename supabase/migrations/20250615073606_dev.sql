drop policy "Enable users to view their own trial data only" on "public"."user_trials";

revoke delete on table "public"."user_trials" from "anon";

revoke insert on table "public"."user_trials" from "anon";

revoke references on table "public"."user_trials" from "anon";

revoke select on table "public"."user_trials" from "anon";

revoke trigger on table "public"."user_trials" from "anon";

revoke truncate on table "public"."user_trials" from "anon";

revoke update on table "public"."user_trials" from "anon";

revoke delete on table "public"."user_trials" from "authenticated";

revoke insert on table "public"."user_trials" from "authenticated";

revoke references on table "public"."user_trials" from "authenticated";

revoke select on table "public"."user_trials" from "authenticated";

revoke trigger on table "public"."user_trials" from "authenticated";

revoke truncate on table "public"."user_trials" from "authenticated";

revoke update on table "public"."user_trials" from "authenticated";

revoke delete on table "public"."user_trials" from "service_role";

revoke insert on table "public"."user_trials" from "service_role";

revoke references on table "public"."user_trials" from "service_role";

revoke select on table "public"."user_trials" from "service_role";

revoke trigger on table "public"."user_trials" from "service_role";

revoke truncate on table "public"."user_trials" from "service_role";

revoke update on table "public"."user_trials" from "service_role";

alter table "public"."user_trials" drop constraint "user_trials_user_id_fkey";

alter table "public"."user_trials" drop constraint "user_trials_pkey";

drop index if exists "public"."user_trials_pkey";

drop table "public"."user_trials";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$function$
;


