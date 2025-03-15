"use client";

import { LoaderProfile } from "@/components/Shared";
import { Link, User } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NotFoundUser, UserProfile } from "./components";
import { useUser } from "@clerk/nextjs";
import { RedirectUserDashboard } from "./components/RedirectUserDashboard";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const { username } = params;

  const [infoUser, setInfoUser] = useState<(User & { links: Link[] }) | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    if (!username) {
      router.replace("/"); // 🔄 Usa `replace()` en lugar de `push()`
      return;
    }

    const getInfoUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/info-user/${username}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setInfoUser(data);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        setInfoUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getInfoUser();
  }, [username, router]);

  if (!user) return null;

  if (isLoading) return <LoaderProfile />;
  if (!infoUser) return <NotFoundUser />;

  return (
    <>
      <UserProfile user={infoUser} />
      {user.id === infoUser.id && <RedirectUserDashboard />}
    </>
  );
}
