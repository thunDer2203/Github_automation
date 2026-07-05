"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function useAuth() {
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
                credentials: "include",
            });

            if (res.status === 401) {
                router.replace("/");
            }
        }

        checkAuth();
    }, [router]);
}