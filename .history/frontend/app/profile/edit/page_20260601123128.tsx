"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function EditProfile() {
  const { user, loading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (!user) return;

    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user!.id)
      .single();

    console.log(data);
    console.log(error);

    if (data) {
      setFullName(data.full_name || "");
      setUsername(data.username || "");
      setBio(data.bio || "");
    }
  };

  const saveProfile = async () => {
    alert("SAVE STARTED");

    if (!user) {
      alert("NO USER");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        username: username,
        bio: bio,
      })
      .eq("id", user.id)
      .select();

    console.log(data);
    console.log(error);

    if (error) {
      alert(error.message);
      return;
    }

    alert("PROFILE UPDATED");
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Edit Profile</h1>

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) =>
          setFullName(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
      />

      <br />
      <br />

      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) =>
          setBio(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={saveProfile}>
        Save Profile
      </button>
    </div>
  );
}