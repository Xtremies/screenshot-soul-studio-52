import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const servicesQuery = () =>
  queryOptions({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("practice_areas").select("*").eq("published", true).order("sort_order");
      if (error) throw error;
      return data;
    },
  });

export const serviceQuery = (slug: string) =>
  queryOptions({
    queryKey: ["service", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("practice_areas").select("*").eq("slug", slug).eq("published", true).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const lawyersQuery = () =>
  queryOptions({
    queryKey: ["lawyers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("lawyers").select("*").eq("published", true).order("sort_order");
      if (error) throw error;
      return data;
    },
  });

export const lawyerQuery = (slug: string) =>
  queryOptions({
    queryKey: ["lawyer", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("lawyers").select("*").eq("slug", slug).eq("published", true).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const articlesQuery = () =>
  queryOptions({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("articles").select("*").eq("published", true).order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const articleQuery = (slug: string) =>
  queryOptions({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).eq("published", true).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
