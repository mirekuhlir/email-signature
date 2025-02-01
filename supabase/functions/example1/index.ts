// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

serve((req: any) => {
    const { method, url } = req;

    /*     if (method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    } */

    if (method === "GET" && url === "/") {
        return new Response("Hello from Supabase Edge Function!", {
            headers: { "Content-Type": "text/plain" },
        });
    }

    return new Response("Not Found", { status: 404 });
});
