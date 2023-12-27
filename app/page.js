"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
export default function Home({ children }) {
  const { data: session } = useSession();
  return (
    <div className="text-blue-900 flex justify-between">
      <h2>Hello,<b>{session?.user?.name ?? "Stranger"}</b> </h2>
      <div className="flex bg-gray-300 text-black">
        <Image
          src={session?.user?.image}
          alt="user image"
          className="rounded-full mx-auto"
          width={30}
          height={35}
        />
        <span className="px-2">{session?.user?.name}</span>
      </div>
    </div>
  );
}
