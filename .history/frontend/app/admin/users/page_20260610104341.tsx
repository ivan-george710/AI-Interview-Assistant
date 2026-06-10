"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    console.log("STARTING USER LOAD");

    const { data, error } = await supabase
      .from("profiles")
      .select("*");

    console.log("USERS DATA:", data);
    console.log("USERS ERROR:", error);

    if (error) {
      alert(error.message);
      return;
    }

    setUsers(data || []);
  };

  const filteredUsers = users.filter((user) =>
    (user.full_name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">
        User Management
      </h1>

      <div className="mb-4 text-cyan-400">
        Loaded Users: {users.length}
      </div>

      <input
        type="text"
        placeholder="Search User..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 mb-6"
      />

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
              User ID
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user) => (
            <tr
              key={user.id}
              className="border-t border-slate-700"
            >
              <td className="p-3">
                {user.full_name}
              </td>

              <td className="p-3">
                {user.role}
              </td>

              <td className="p-3">
                {user.id}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}