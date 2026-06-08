"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
const router = useRouter();

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

const [email, setEmail] = useState("");

const [fullName, setFullName] =
useState("");

const [username, setUsername] =
useState("");

const [bio, setBio] =
useState("");

const [avatarUrl, setAvatarUrl] =
useState("");

const [role, setRole] =
useState("");

useEffect(() => {
loadProfile();
}, []);

const loadProfile = async () => {
const {
data: { user },
} = await supabase.auth.getUser();


if (!user) {
  router.push("/login");
  return;
}

setEmail(user.email || "");

const { data, error } =
  await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

if (error) {
  console.error(error);
  setLoading(false);
  return;
}

setFullName(
  data.full_name || ""
);

setUsername(
  data.username || ""
);

setBio(
  data.bio || ""
);

setAvatarUrl(
  data.avatar_url || ""
);

setRole(
  data.role || "user"
);

setLoading(false);


};

const saveProfile = async () => {
setSaving(true);

const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  setSaving(false);
  return;
}

const { error } =
  await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      username: username,
      bio: bio,
    })
    .eq("id", user.id);

setSaving(false);

if (error) {
  alert(error.message);
  return;
}

alert(
  "Profile updated successfully"
);


};

if (loading) {
return ( <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
Loading... </div>
);
}

return ( <main className="min-h-screen bg-slate-950 text-white"> <div className="max-w-4xl mx-auto px-8 py-12"> <h1 className="text-4xl font-bold mb-2">
Settings </h1>


    <p className="text-slate-400 mb-10">
      Manage your account details
    </p>

    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full bg-cyan-500 flex items-center justify-center text-3xl font-bold">
          {fullName
            ? fullName
                .split(" ")
                .map(
                  (n) => n[0]
                )
                .join("")
                .slice(0, 2)
                .toUpperCase()
            : "U"}
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            {fullName || "User"}
          </h2>

          <p className="text-slate-400">
            {email}
          </p>

          <p className="text-cyan-400 text-sm mt-1">
            {role}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block mb-2 text-sm">
            Full Name
          </label>

          <input
            value={fullName}
            onChange={(e) =>
              setFullName(
                e.target.value
              )
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">
            Username
          </label>

          <input
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">
            Email
          </label>

          <input
            value={email}
            disabled
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 opacity-70"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">
            Bio
          </label>

          <textarea
            rows={5}
            value={bio}
            onChange={(e) =>
              setBio(
                e.target.value
              )
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
          />
        </div>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="bg-cyan-500 text-black px-6 py-3 rounded-xl font-semibold hover:opacity-90"
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
</main>


);
}
