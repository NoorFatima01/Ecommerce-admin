"use client";
import Nav from "@/components/Nav";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LayoutDesign({children}) {
  const { data: session, status } = useSession();
  if (!session)
    return (
      <main className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button
            className="bg-white p-4 rounded-lg"
            onClick={() => signIn("google")}
          >
            Login With Google
          </button>
        </div>
      </main>
    );

  return (
    <div className="bg-blue-900 min-h-screen flex">
      <Nav />
      {/* flex grow and not justify between */}
      <div className="bg-white flex-grow mt-1 mr-2 rounded-lg p-4 mb-2">{children}</div>
    </div>
  );
}
