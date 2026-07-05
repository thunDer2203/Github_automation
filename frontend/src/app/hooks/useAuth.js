"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const API = "http://localhost:5000";

export default function useAuth() {
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            const res = await fetch(`${API}/auth/me`, {
                credentials: "include",
            });

            if (res.status === 401) {
                router.replace("/");
            }
        }

        checkAuth();
    }, [router]);
}