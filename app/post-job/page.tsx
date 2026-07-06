"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // New state for inline messages instead of alerts
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    categoryId: "",
    type: "FULL_TIME",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Retrieve the token. Verify this key matches what your login function uses!
    const token = localStorage.getItem("accessToken");

    // Prevent network request if token is completely missing
    if (!token) {
      setError("You are not logged in. Please log in to post a job.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess("Job posted successfully! Redirecting...");
        // Wait 2 seconds so the user can read the success message, then redirect
        setTimeout(() => {
          router.push("/jobs");
        }, 2000);
      } else {
        const errorData = await response.json();

        // Handle specific 401 Unauthorized errors gracefully
        if (response.status === 401) {
          setError("Session expired or unauthorized. Please log in again.");
        } else {
          // Display the specific validation error from NestJS
          setError(
            errorData.message ||
              "Failed to post job. Please check your inputs.",
          );
        }
      }
    } catch (err) {
      console.error("Failed to post job:", err);
      setError("Network error. Please ensure the backend is running.");
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
        className="mt-8 rounded-2xl border border-border bg-white p-7 space-y-6 shadow-sm"
      >
        {/* Inline Feedback Messages */}
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">
            {success}
          </div>
        )}

        {/* Job Title */}
        <div>
          <label htmlFor="jobTitle" className="text-xs font-semibold text-ink">
            Job Title
          </label>
          <input
            id="jobTitle"
            name="title"
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
            <label
              htmlFor="companyName"
              className="text-xs font-semibold text-ink"
            >
              Company
            </label>
            <input
              id="companyName"
              name="company"
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
            <label
              htmlFor="jobLocation"
              className="text-xs font-semibold text-ink"
            >
              Location
            </label>
            <input
              id="jobLocation"
              name="location"
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
            <label
              htmlFor="categoryId"
              className="text-xs font-semibold text-ink"
            >
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
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
            <label htmlFor="jobType" className="text-xs font-semibold text-ink">
              Job Type
            </label>
            <select
              id="jobType"
              name="type"
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
          <label
            htmlFor="jobDescription"
            className="text-xs font-semibold text-ink"
          >
            Job Description
          </label>
          <textarea
            id="jobDescription"
            name="description"
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
