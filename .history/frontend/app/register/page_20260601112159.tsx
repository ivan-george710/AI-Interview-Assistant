"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const { error } = await signUp(
      email,
      password
    );

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Registration successful. Check email."
    );
  };

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit">
          Register
        </button>
      </form>
    </div>
  );
}