"use client"
// import { AuthScreen } from "@/features/auth/components/auth-screen";

import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";


export default function Home() {
  const { signOut } = useAuthActions();

  return (
    <div className=" flex items-center justify-center h-full bg-red-500 gap-x-2">
      Logged In!

      <Button onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  );
}


{/* <div className=" flex items-center justify-center bg-[#5C3B58] w-full h-full">
Home
</div> */}