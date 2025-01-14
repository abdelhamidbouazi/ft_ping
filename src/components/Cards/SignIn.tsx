"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import pingpong from "../../../public/pingpong.gif";
import { Button, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function SignInCard() {
  const [loading, setLoading] = useState(false);

  const handleSignInClick = async () => {
    setLoading(true);
    try {
      setLoading(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message,
        {
          toastId: 'error1'
        })
      setLoading(false);
    }
  };

  return (
    <div className="items-center max-w-md rounded-lg midnight shadow">
      <form
        className="p-4 md:p-5 lg:p-6"
      >
        <div className="grid gap-y-3">

          <Link href={`/auth/auth_first`}>
            <Button isLoading={loading} 
              className="flex items-center justify-center gap-x-5 rounded-md text-midnight-secondary border border-midnight-border bg-midnight py-3 px-4 transition hover:bg-midnight-light hover:text-midnight-secondary"
              spinner={<Spinner />} onClick={handleSignInClick}>
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    <Image
                      src="/42_logo.png"
                      alt="Intra Logo"
                      className="dark:invert"
                      width={24}
                      height={20}
                      priority
                    />
                    Sign in with 42 Intra
                  </>
                )}
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
