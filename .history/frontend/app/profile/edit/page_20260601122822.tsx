"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EditProfile() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    console.log("PROFILE:", data);
    console.log("PROFILE ERROR:", error);

    if (data) {
      setFullName(data.full_name || "");
      setUsername(data.username || "");
      setBio(data.bio || "");
      setAvatarUrl(data.avatar_url || "");
    }
  };

  const handleAvatarUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = e.target.files?.[0];

      if (!file) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login first");
        return;
      }

      setLoading(true);

      const fileExt = file.name.split(".").pop();

      const filePath =
        `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } =
        await supabase.storage
          .from("profile-images")
          .upload(filePath, file, {
            upsert: true,
          });

      if (uploadError) {
        alert(uploadError.message);
        setLoading(false);
        return;
      }

      const { data } =
        supabase.storage
          .from("profile-images")
          .getPublicUrl(filePath);

      const publicUrl =
        data.publicUrl;

      const { error: updateError } =
        await supabase
          .from("profiles")
          .update({
            avatar_url: publicUrl,
          })
          .eq("id", user.id);

      console.log(
        "AVATAR UPDATE ERROR:",
        updateError
      );

      if (updateError) {
        alert(updateError.message);
        setLoading(false);
        return;
      }

      setAvatarUrl(publicUrl);

      alert("Avatar Uploaded");

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const saveProfile = async () => {
  alert("SAVE STARTED");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  alert(
    "USER: " +
      JSON.stringify(user)
  );

  if (!user) {
    alert("NO USER FOUND");
    return;
  }

  const { data, error } =
    await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        username,
        bio,
      })
      .eq("id", user.id)
      .select();

  alert(
    "ERROR: " +
      JSON.stringify(error)
  );

  alert(
    "DATA: " +
      JSON.stringify(data)
  );

  if (error) {
    return;
  }

  alert("PROFILE UPDATED");
};
  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "600px",
      }}
    >
      <h1>Edit Profile</h1>

      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="Avatar"
          width={150}
          height={150}
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "20px",
          }}
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) =>
          setFullName(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
        }}
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
        style={{
          width: "100%",
          padding: "10px",
        }}
      />

      <br />
      <br />

      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) =>
          setBio(e.target.value)
        }
        rows={5}
        style={{
          width: "100%",
          padding: "10px",
        }}
      />

      <br />
      <br />

      <button
  onClick={() => {
    alert("BUTTON CLICKED");
    saveProfile();
  }}
>
  Save Profile
</button>
    </div>
  );
}