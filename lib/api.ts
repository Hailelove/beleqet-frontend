const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api/v1`
  : "http://127.0.0.1:4000/api/v1";

export type ApiJob = {
  id: string;
  title: string;
  description: string;
  requirements: string; // plain string, e.g. "React, TypeScript, 3+ years experience and the like"
  location: string;
  type: "FULL_TIME" | "PART_TIME" | "REMOTE" | "HYBRID" | "CONTRACT";
  salaryMin?: number | null;
  salaryMax?: number | null;
  categoryId: string;
  category?: { id: string; slug: string; label: string; icon: string };
  company?: { id: string; name: string; logoUrl?: string | null };
  companyName?: string | null;
  createdAt: string;
};

export type ApiCategory = {
  id: string;
  slug: string;
  label: string;
  icon: string;
  count?: number;
};

export async function fetchJobs(params?: {
  q?: string;
  category?: string;
  location?: string;
  type?: string;
  page?: number;
  limit?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.q) qs.set("q", params.q);
  if (params?.category) qs.set("category", params.category);
  if (params?.location) qs.set("location", params.location);
  if (params?.type) qs.set("type", params.type);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));

  const res = await fetch(`${API_BASE}/jobs?${qs.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.status}`);
  const json = await res.json();
  return { data: json.items as ApiJob[], total: json.total as number };
}

export async function fetchJobById(id: string) {
  const res = await fetch(`${API_BASE}/jobs/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json() as Promise<ApiJob>;
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/jobs/categories`, {
    cache: "no-store",
  }).catch(() => null);
  if (!res || !res.ok) return [];
  return res.json() as Promise<ApiCategory[]>;
}
