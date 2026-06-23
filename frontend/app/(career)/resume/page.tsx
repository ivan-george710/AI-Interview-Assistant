"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Resume {
  id: number;
  user_id: string;
  file_url: string;
  storage_path: string;
  ats_score: number;
  created_at: string;
}

export default function ResumePage() {
  const [resume, setResume] =
    useState<Resume | null>(null);

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } =
        await supabase
          .from("resumes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          })
          .limit(1)
          .single();

      if (!error && data) {
        setResume(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadResume = async () => {
    try {
      if (!file) {
        alert("Please select a resume");
        return;
      }

      setUploading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login");
        return;
      }

      const fileName =
        `${user.id}-${Date.now()}-${file.name}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("resume-files")
        .upload(fileName, file);

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const {
        data: publicData,
      } = supabase.storage
        .from("resume-files")
        .getPublicUrl(fileName);

      const {
        data,
        error: dbError,
      } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          file_url:
            publicData.publicUrl,
          storage_path: fileName,
          ats_score: 0,
        })
        .select()
        .single();

      if (dbError) {
        alert(dbError.message);
        return;
      }

      setResume(data);
      setFile(null);

      alert(
        "Resume uploaded successfully"
      );
    } catch (error) {
      console.error(error);
      alert(
        "Unexpected error occurred"
      );
    } finally {
      setUploading(false);
    }
  };

  const deleteResume = async () => {
    if (!resume) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this resume?"
      );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const {
        error: storageError,
      } = await supabase.storage
        .from("resume-files")
        .remove([
          resume.storage_path,
        ]);

      if (storageError) {
        alert(
          storageError.message
        );
        return;
      }

      const {
        error: dbError,
      } = await supabase
        .from("resumes")
        .delete()
        .eq("id", resume.id);

      if (dbError) {
        alert(dbError.message);
        return;
      }

      setResume(null);

      alert(
        "Resume deleted successfully"
      );
    } catch (error) {
      console.error(error);
      alert(
        "Failed to delete resume"
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Resume
        </h1>

        <p className="text-slate-400 mb-8">
          Upload and manage your
          resume
        </p>

        {resume ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

            <div className="flex justify-between items-start mb-6">

              <div>
                <h2 className="text-2xl font-semibold">
                  Resume Uploaded
                </h2>

                <p className="text-slate-400 mt-2">
                  Your resume is ready
                  for ATS analysis.
                </p>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-xl">

                <span className="text-cyan-400">
                  ATS Score:
                </span>

                <span className="ml-2 font-semibold">
                  {resume.ats_score}
                </span>

              </div>

            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-6">

              <p className="text-slate-400 text-sm">
                Uploaded On
              </p>

              <p className="mt-1">
                {new Date(
                  resume.created_at
                ).toLocaleString()}
              </p>

            </div>

            <div className="flex gap-4">

              <a
                href={resume.file_url}
                target="_blank"
                rel="noreferrer"
                className="bg-cyan-500 text-black px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                View Resume
              </a>

              <button
                onClick={deleteResume}
                disabled={deleting}
                className="border border-red-500 text-red-400 px-6 py-3 rounded-xl hover:bg-red-500/10 transition"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Resume"}
              </button>

            </div>

          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

            <h2 className="text-2xl font-semibold mb-2">
              Upload Resume
            </h2>

            <p className="text-slate-400 mb-6">
              No resume found for your
              account.
            </p>

            <div className="mb-6">

              <label
                className="
                  inline-block
                  cursor-pointer
                  bg-slate-950
                  border
                  border-slate-700
                  hover:border-cyan-500
                  hover:bg-slate-900
                  px-5
                  py-3
                  rounded-xl
                  transition
                "
              >
                Choose Resume

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    setFile(
                      e.target.files?.[0] ??
                        null
                    )
                  }
                  className="hidden"
                />
              </label>

              <p className="text-slate-400 mt-3">
                {file
                  ? file.name
                  : "No file selected"}
              </p>

            </div>

            <button
              onClick={uploadResume}
              disabled={
                uploading || !file
              }
              className="
                bg-cyan-500
                text-black
                px-6
                py-3
                rounded-xl
                font-semibold
                hover:opacity-90
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {uploading
                ? "Uploading..."
                : "Upload Resume"}
            </button>

          </div>
        )}

      </div>

    </div>
  );
}