// Server Component
import { Suspense } from "react";
import JobsListing from "@/components/JobsListing";
import { fetchJobs, fetchCategories } from "@/lib/api";
import { adaptJob } from "@/lib/adapters";

export const dynamic = "force-dynamic";

async function JobsListingLoader({
  searchParams,
}: {
  searchParams: { [k: string]: string };
}) {
  const { data } = await fetchJobs({
    q: searchParams.q,
    category: searchParams.category,
    location: searchParams.loc,
  });
  const categories = await fetchCategories();
  return (
    <JobsListing initialJobs={data.map(adaptJob)} categories={categories} />
  );
}

export default function JobsPage({
  searchParams,
}: {
  searchParams: { [k: string]: string };
}) {
  return (
    <Suspense
      fallback={
        <div className="container-page py-20 text-center text-muted">
          Loading jobs…
        </div>
      }
    >
      <JobsListingLoader searchParams={searchParams} />
    </Suspense>
  );
}
