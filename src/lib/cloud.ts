import { createClient } from "@supabase/supabase-js";
import type { TrackingData } from "@/lib/tracking";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const cloudEnabled = !!url && !!key;

const supabase = cloudEnabled ? createClient(url!, key!) : null;

export async function fetchTrackingByCode(code: string): Promise<TrackingData | null> {
  if (!cloudEnabled || !supabase) return null;
  const { data, error } = await supabase
    .from("tracking")
    .select("data")
    .eq("code", code.toUpperCase())
    .maybeSingle();
  if (error) return null;
  return (data?.data as TrackingData) ?? null;
}

export async function saveTrackingToCloud(tracking: TrackingData): Promise<boolean> {
  if (!cloudEnabled || !supabase) return false;
  const payload = { code: tracking.code.toUpperCase(), data: tracking };
  const { error } = await supabase.from("tracking").upsert(payload, { onConflict: "code" });
  return !error;
}
