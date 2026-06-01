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

    console.log("PROFILE DATA:", data);
    console.log("PROFILE ERROR:", error);

    if (error) {
      alert(error.message);
      return;
    }

    if (data) {
      setFullName(data.full_name || "");
      setUsername(data.username || "");
      setBio(data.bio || "");
    }
  };

  const saveProfile = async () => {
    try {
      if (!user) {
        alert("User not found");
        return;
      }

      console.log("Updating profile for:", user.id);

      const { data, error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          username: username,
          bio: bio,
        })
        .eq("id", user.id)
        .select();

      console.log("UPDATE DATA:", data);
      console.log("UPDATE ERROR:", error);

      if (error) {
        alert(error.message);
        return;
      }

      alert("Profile Updated Successfully");
    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert("Unexpected error occurred");
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "40px", maxWidth: "600px" }}>
      <h1>Edit Profile</h1>

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
        }}
      />

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
        }}
      />

      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={5}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
        }}
      />

      <button onClick={saveProfile}>
        Save Profile
      </button>
    </div>
  );
}