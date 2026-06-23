"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UsersPage() {

  const [users, setUsers] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [currentUserId, setCurrentUserId] =
    useState("");

  useEffect(() => {
    getCurrentUser();
    loadUsers();
  }, []);

  const getCurrentUser =
    async () => {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (user) {
        setCurrentUserId(
          user.id
        );
      }
    };

  const loadUsers =
    async () => {

      const {
        data,
        error
      } =
        await supabase
          .from("profiles")
          .select("*");

      if (error) {
        alert(
          error.message
        );
        return;
      }

      const enrichedUsers =
        await Promise.all(

          (data || []).map(
            async (
              user
            ) => {

              const {
                data:
                  resumes
              } =
                await supabase
                  .from(
                    "resume_profiles"
                  )
                  .select(
                    "id"
                  )
                  .eq(
                    "user_id",
                    user.id
                  );

              const {
                data:
                  attempts
              } =
                await supabase
                  .from(
                    "assessment_attempts"
                  )
                  .select(
                    "id"
                  )
                  .eq(
                    "user_id",
                    user.id
                  );

              return {

                ...user,

                resumeCount:
                  resumes?.length ||
                  0,

                assessmentCount:
                  attempts?.length ||
                  0

              };
            }
          )
        );

      setUsers(
        enrichedUsers
      );
    };

  const updateRole =
    async (
      userId: string,
      role: string
    ) => {

      if (
        userId ===
          currentUserId &&
        role === "user"
      ) {

        alert(
          "You cannot remove your own admin access."
        );

        return;
      }

      const {
        error
      } =
        await supabase
          .from(
            "profiles"
          )
          .update({
            role
          })
          .eq(
            "id",
            userId
          );

      if (error) {

        alert(
          error.message
        );

        return;
      }

      loadUsers();
    };

  const deleteUser =
    async (
      userId: string
    ) => {

      const confirmDelete =
        confirm(
          "Delete this user?"
        );

      if (
        !confirmDelete
      )
        return;

      const {
        error
      } =
        await supabase
          .from(
            "profiles"
          )
          .delete()
          .eq(
            "id",
            userId
          );

      if (error) {

        alert(
          error.message
        );

        return;
      }

      loadUsers();
    };

  const filteredUsers =
    users.filter(
      (user) =>
        (
          user.full_name ||
          ""
        )
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-4">
        User Management
      </h1>

      <div className="mb-4 text-cyan-400">
        Loaded Users:
        {" "}
        {
          users.length
        }
      </div>

      <input
        type="text"
        placeholder="Search User..."
        value={search}
        onChange={(
          e
        ) =>
          setSearch(
            e.target.value
          )
        }
        className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 mb-6"
      />

      <div className="overflow-x-auto">

        <table className="w-full border border-slate-700">

          <thead className="bg-slate-900">

            <tr>

              <th className="p-3 text-left">
                Name
              </th>

              <th className="p-3 text-left">
                Role
              </th>

              <th className="p-3 text-left">
                Resume
              </th>

              <th className="p-3 text-left">
                Assessments
              </th>

              <th className="p-3 text-left">
                User ID
              </th>

              <th className="p-3 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredUsers.map(
              (
                user
              ) => (

                <tr
                  key={
                    user.id
                  }
                  className="border-t border-slate-700"
                >

                  <td className="p-3">
                    {
                      user.full_name
                    }
                  </td>

                  <td className="p-3">

                    <span
                      className={`px-3 py-1 rounded ${
                        user.role ===
                        "admin"
                          ? "bg-cyan-500 text-black"
                          : "bg-slate-800"
                      }`}
                    >
                      {
                        user.role
                      }
                    </span>

                  </td>

                  <td className="p-3">

                    {
                      user.resumeCount >
                      0
                        ? "Uploaded"
                        : "No Resume"
                    }

                  </td>

                  <td className="p-3">

                    {
                      user.assessmentCount
                    }

                  </td>

                  <td className="p-3 text-xs">

                    {
                      user.id
                    }

                  </td>

                  <td className="p-3">

                    <div className="flex gap-2 flex-wrap">

                      {user.role ===
                      "admin" ? (

                        <button
                          onClick={() =>
                            updateRole(
                              user.id,
                              "user"
                            )
                          }
                          disabled={
                            user.id ===
                            currentUserId
                          }
                          className="bg-red-500 px-3 py-2 rounded-lg disabled:opacity-50"
                        >
                          Remove Admin
                        </button>

                      ) : (

                        <button
                          onClick={() =>
                            updateRole(
                              user.id,
                              "admin"
                            )
                          }
                          className="bg-cyan-500 text-black px-3 py-2 rounded-lg"
                        >
                          Make Admin
                        </button>

                      )}

                      <button
  onClick={() =>
    window.location.href =
      `/admin/users/${user.id}`
  }
  className="bg-purple-600 px-3 py-2 rounded-lg"
>
  View Resume
</button>

<button
  onClick={() =>
    deleteUser(
      user.id
    )
  }
  className="bg-red-700 px-3 py-2 rounded-lg"
>
  Delete
</button>

                    </div>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}