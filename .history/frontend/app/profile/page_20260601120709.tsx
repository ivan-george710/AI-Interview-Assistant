"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
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

      setProfile(data);
    };

    loadProfile();
  }, []);

  if (!profile) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Profile</h1>

      <p>Name: {profile.full_name}</p>
      <p>Username: {profile.username}</p>
      <p>Bio: {profile.bio}</p>
    </div>
  );
}