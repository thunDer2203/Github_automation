"use client";

export default function Home() {
  const login = () => {
    window.location.href = "http://localhost:5000/auth/github";
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <button
        onClick={login}
        className="rounded bg-black px-6 py-3 text-white hover:bg-gray-800"
      >
        Login with GitHub
      </button>
    </main>
  );
}