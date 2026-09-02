"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./supabase-config";

/**
 * Client Supabase du navigateur, réservé au back-office.
 *
 * Instancié à la demande (et une seule fois) pour que le SDK ne parte pas
 * dans le bundle des pages publiques, qui lisent les articles en `fetch`.
 */
let client: SupabaseClient | null = null;

export function supabaseBrowser(): SupabaseClient {
  client ??= createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: "mugitu-admin-auth" },
  });
  return client;
}
