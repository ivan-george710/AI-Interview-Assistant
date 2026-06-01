"use client";

import { useAuth } from "@/context/AuthContext";

export default function EditProfile() {
  const { user, loading } =
    useAuth();

  return (
    <div
      style={{
        padding: "40px",
      }}
    >
      <h1>
        Profile Debug
      </h1>

      <p>
        Loading:
        {" "}
        {String(loading)}
      </p>

      <p>
        User:
      </p>

      <pre>
        {JSON.stringify(
          user,
          null,
          2
        )}
      </pre>
    </div>
  );
}