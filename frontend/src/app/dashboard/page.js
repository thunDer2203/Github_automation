"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/auth/me", {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then(setUser)
      .catch(console.error);
  }, []);

  if (!user) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="p-10">
      <img
        src={user.avatarUrl}
        width={100}
        alt="avatar"
      />

      <h1>{user.username}</h1>

      <p>{user.id}</p>

      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}