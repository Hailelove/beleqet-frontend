"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 1. Centralized state for all form fields
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    categoryId: "",
    type: "FULL_TIME", // Default to FULL_TIME
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Retrieve the token (adjust this based on where you store it)
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Sends the secure token to Render
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Job posted successfully!");
        router.push("/jobs");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`); // Displays backend validation errors
      }
    } catch (error) {
      console.error("Failed to post job:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-ink">Post a Job</h1>
      <p className="text-muted mt-4 leading-relaxed">
        Reach thousands of verified job seekers across Ethiopia. Fill out the
        form below to publish your listing.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-border bg-white p-7 space-y-6"
      >
        {/* Job Title */}
        <div>
          <label className="text-xs font-semibold text-ink">Job Title</label>
          <input
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g. Senior Software Engineer"
            className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brandGreen"
          />
        </div>

        {/* Company and Location (Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-ink">Company</label>
            <input
              required
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              placeholder="e.g. Beleqet Tech"
              className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brandGreen"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink">Location</label>
            <input
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g. Addis Ababa"
              className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brandGreen"
            />
          </div>
        </div>

        {/* Category and Job Type (Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-ink">Category</label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brandGreen bg-white"
            >
              <option value="" disabled>
                Select a Category
              </option>
              {/* Replace these with real category IDs from your database later */}
              <option value="software-design-and-development">
                Software Development
              </option>
              <option value="accounting-and-finance">
                Accounting & Finance
              </option>
              <option value="marketing-and-advertisement">Marketing</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink">Job Type</label>
            <select
              required
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brandGreen bg-white"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label className="text-xs font-semibold text-ink">
            Job Description
          </label>
          <textarea
            required
            rows={5}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe the responsibilities and requirements..."
            className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brandGreen"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brandGreen text-white text-sm font-semibold py-3 hover:bg-darkGreen transition-colors disabled:opacity-70"
        >
          {loading ? "Publishing..." : "Publish Listing"}
        </button>
      </form>
    </div>
  );
}
