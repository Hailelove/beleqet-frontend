const envUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const API_BASE = envUrl
  ? envUrl.endsWith("/api/v1")
    ? envUrl
    : `${envUrl}/api/v1`
  : "http://127.0.0.1:4000/api/v1";

export type ApiJob = {
  id: string;
  title: string;
  description: string;
  // Updated to reflect that your DB seed might return this as an array
  requirements: string | string[];
  location: string;
  type?: "FULL_TIME" | "PART_TIME" | "REMOTE" | "HYBRID" | "CONTRACT";
  jobType?: "FULL_TIME" | "PART_TIME" | "REMOTE" | "HYBRID" | "CONTRACT";
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

  try {
    const res = await fetch(`${API_BASE}/jobs?${qs.toString()}`, {
      cache: "no-store",
    });

    // 2. Instead of throwing an error that crashes Next.js, return an empty state
    if (!res.ok) {
      console.error(
        `Backend returned an error: ${res.status} ${res.statusText}`,
      );
      return { data: [], total: 0 };
    }

    const json = await res.json();
    return {
      data: (json.items || []) as ApiJob[],
      total: (json.total || 0) as number,
    };
  } catch (error) {
    // 3. Catch total network failures (e.g., backend is offline)
    console.error("Network or fetch error in fetchJobs:", error);
    return { data: [], total: 0 };
  }
}

export async function fetchJobById(id: string) {
  try {
    const res = await fetch(`${API_BASE}/jobs/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as ApiJob;
  } catch (error) {
    console.error(`Error fetching job ${id}:`, error);
    return null;
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/jobs/categories`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as ApiCategory[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
