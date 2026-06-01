"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
  const [password, setPassword] =
    useState("");

  const updatePassword = async () => {
    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password Updated");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Reset Password</h1>

      <input
        type="password"
        placeholder="New Password"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br /><br />

      <button onClick={updatePassword}>
        Update Password
      </button>
    </div>
  );
}