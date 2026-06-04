"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ResumePage() {
  const [file, setFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const uploadResume = async () => {
    try {
      if (!file) {
        alert(
          "Please select a resume"
        );
        return;
      }

      setUploading(true);

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        alert("Please login");
        return;
      }

      const fileName =
        `${user.id}-${Date.now()}-${file.name}`;

      console.log(
        "Uploading file:",
        fileName
      );

      const {
        error: uploadError,
      } = await supabase.storage
        .from("resume-files")
        .upload(
          fileName,
          file
        );

      if (uploadError) {
        console.log(
          "UPLOAD ERROR:",
          uploadError
        );

        alert(
          uploadError.message
        );

        setUploading(false);
        return;
      }

      const {
        data: publicData,
      } = supabase.storage
        .from("resume-files")
        .getPublicUrl(
          fileName
        );

      console.log(
        "USER:",
        user.id
      );

      console.log(
        "URL:",
        publicData.publicUrl
      );

      const {
        data,
        error: dbError,
      } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          file_url:
            publicData.publicUrl,
          ats_score: 0,
        })
        .select();

      console.log(
        "DB DATA:",
        data
      );

      if (dbError) {
        console.log(
          "DB ERROR:",
          dbError
        );

        alert(
          JSON.stringify(
            dbError
          )
        );

        setUploading(false);
        return;
      }

      alert(
        "Resume uploaded successfully"
      );

      setFile(null);
    } catch (error) {
      console.log(
        "GENERAL ERROR:",
        error
      );

      alert(
        "Unexpected error occurred"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        ATS Resume Analyzer
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-2xl">

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) =>
            setFile(
              e.target.files?.[0] ||
                null
            )
          }
          className="mb-6 block"
        />

        {file && (
          <p className="mb-4 text-cyan-400">
            Selected:
            {" "}
            {file.name}
          </p>
        )}

        <button
          onClick={uploadResume}
          disabled={uploading}
          className="bg-cyan-500 text-black px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          {uploading
            ? "Uploading..."
            : "Upload Resume"}
        </button>

      </div>

    </div>
  );
}