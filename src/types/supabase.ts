import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export type TypedSupabaseClient = SupabaseClient<Database>;

export type Tables<T extends keyof Database> = Database[T];
export type TableRow<T extends keyof Database> = Tables<T>[number];
