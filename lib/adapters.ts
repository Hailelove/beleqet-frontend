import type { Job } from "./mockData";
import type { ApiJob } from "./api";

// 1. Create a mapping object to bridge the database and your UI
const typeMap: Record<
  string,
  "Full Time" | "Part Time" | "Remote" | "Hybrid" | "Contract" | "On-site"
> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  CONTRACT: "Contract",
  ON_SITE: "On-site",
};

function timeAgo(dateStr: string) {
  if (!dateStr) return "recently";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(diffMs / 3_600_000);

  if (isNaN(hrs)) return "recently";
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function adaptJob(apiJob: any): Job {
  // 1. Safely handle requirements array (from Prisma seed) or string formats
  let tagsArray: string[] = [];
  if (apiJob.requirements) {
    if (Array.isArray(apiJob.requirements)) {
      tagsArray = apiJob.requirements
        .map((s: string) => s.trim())
        .filter(Boolean);
    } else if (typeof apiJob.requirements === "string") {
      tagsArray = apiJob.requirements
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
  }

  
  const rawType = apiJob.jobType ?? apiJob.type ?? "FULL_TIME";
  const normalizedType = typeMap[rawType] ?? "Full Time";

  
  return {
    id: apiJob.id,
    title: apiJob.title,
    company: apiJob.company?.name ?? apiJob.companyName ?? "Unknown Company",
    location: apiJob.location,
    type: normalizedType, // Use the mapped, human-readable string
    category: apiJob.categoryId ?? apiJob.category,
    postedAgo: timeAgo(apiJob.createdAt),
    description: apiJob.description,
    tags: tagsArray,
    categoryId: apiJob.categoryId,
  } as Job;
}
