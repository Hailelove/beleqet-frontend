import type { Job } from "./mockData";
import type { ApiJob } from "./api";

const typeMap: Record<ApiJob["type"], Job["type"]> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  CONTRACT: "Contract",
};

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(diffMs / 3_600_000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function adaptJob(apiJob: ApiJob): Job {
  return {
    id: apiJob.id,
    title: apiJob.title,
    company: apiJob.company?.name ?? apiJob.companyName ?? "Unknown Company",
    location: apiJob.location,
    type: typeMap[apiJob.type] ?? "Full Time",
    category: apiJob.categoryId,
    postedAgo: timeAgo(apiJob.createdAt),
    description: apiJob.description,
    tags: apiJob.requirements
      ? apiJob.requirements
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
  };
}
