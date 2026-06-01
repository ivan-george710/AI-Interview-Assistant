"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function EditProfile() {
  const { user, loading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (!user) return;

    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
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
      setAvatarUrl(data.avatar_url || "");
    }
  };

  const handleAvatarUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = e.target.files?.[0];

      if (!file) {
        alert("Please select a file");
        return;
      }

      if (!user) {
        alert("User not found");
        return;
      }

      const fileExt =
        file.name.split(".").pop();

      const filePath =
        `avatars/${user.id}-${Date.now()}.${fileExt}`;

      const {
        data: uploadData,
        error: uploadError,
      } = await supabase.storage
        .from("profile-images")
        .upload(filePath, file);

      console.log(
        "UPLOAD DATA:",
        uploadData
      );

      console.log(
        "UPLOAD ERROR:",
        uploadError
      );

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const { data } =
        supabase.storage
          .from("profile-images")
          .getPublicUrl(filePath);

      const publicUrl =
        data.publicUrl;

      console.log(
        "PUBLIC URL:",
        publicUrl
      );

      const {
        error: updateError,
      } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrl,
        })
        .eq("id", user.id);

      console.log(
        "DB UPDATE ERROR:",
        updateError
      );

      if (updateError) {
        alert(updateError.message);
        return;
      }

      setAvatarUrl(publicUrl);

      alert(
        "Avatar Uploaded Successfully"
      );
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const saveProfile = async () => {
    try {
      if (!user) {
        alert("User not found");
        return;
      }

      const { data, error } =
        await supabase
          .from("profiles")
          .update({
            full_name: fullName,
            username: username,
            bio: bio,
          })
          .eq("id", user.id)
          .select();

      console.log(
        "UPDATE DATA:",
        data
      );

      console.log(
        "UPDATE ERROR:",
        error
      );

      if (error) {
        alert(error.message);
        return;
      }

      alert(
        "Profile Updated Successfully"
      );
    } catch (err) {
      console.error(err);
      alert(
        "Failed to update profile"
      );
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

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

      <button onClick={saveProfile}>
        Save Profile
      </button>
    </div>
  );
}