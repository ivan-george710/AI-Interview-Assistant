"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EditProfile() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setFullName(data.full_name || "");
      setUsername(data.username || "");
      setBio(data.bio || "");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const saveProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        username: username,
        bio: bio,
      })
      .eq("id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Profile Updated");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Edit Profile</h1>

      <input
        value={fullName}
        onChange={(e) =>
          setFullName(e.target.value)
        }
        placeholder="Full Name"
      />

      <br /><br />

      <input
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
        placeholder="Username"
      />

      <br /><br />

      <textarea
        value={bio}
        onChange={(e) =>
          setBio(e.target.value)
        }
        placeholder="Bio"
      />

      <br /><br />

      <button onClick={saveProfile}>
        Save
      </button>
    </div>
  );
}