-- This migration was auto-generated but the constraint already exists
-- No changes needed as users table already has proper PRIMARY KEY

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
  values (new.id, now() + interval '40 days');
  
  return new;
end;
$function$
;


