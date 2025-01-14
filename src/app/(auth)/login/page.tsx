"use client";

import { Image } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { Button, Spinner } from "@nextui-org/react";
import Link from "next/link";
import ping from "../../../../public/ping.gif";
import { toast } from "react-toastify";

export default function SignInPage() {
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
    <div className="flex flex-col h-screen w-screen  justify-evenly pb-52">
      <div className=" text-white mx-auto">
        <Image
          width={80}
          height={80}
          isBlurred={true}
          alt="logoPing"
          src="https://ik.imagekit.io/efcyow6m0/pongLogo.svg?updatedAt=1705235781369"
        />
      </div>
      <div className="flex flex-row justify-center items-center">
        <div className=" border border-midnight-border rounded-lg shadow-2xl">
          <Image
            shadow="lg"
            width={800}
            height={300}
            isBlurred={true}
            alt="pingpong"
            src={
              "https://www.freegameplanet.com/wp-content/uploads/2016/03/Pong-Pong.gif?x96962"
            }
          />
        </div>
        <div className="items-center">
          <div className="max-w-2xl text-center text-5xl text-midnight-secondary">
            Bounce into joy: Where paddles meet giggles, join the ping pong
            party extravaganza!
          </div>
          <div className="grid gap-y-3 p-2 justify-center pt-8">
            <Link href={`${process.env.NEXT_PUBLIC_IP_BACK}/auth/auth_first`}>
              <Button
                isLoading={loading}
                className="w-80 h-12 gap-x-5 flex rounded-md text-midnight-secondary border border-midnight-border bg-midnight py-3 px-4 transition hover:bg-midnight-light hover:text-midnight-secondary"
                spinner={<Spinner />}
                onClick={handleSignInClick}
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    <Image
                      className="rounded-none"
                      src="/42Logo.svg"
                      alt="Logo Intra"
                      width={24}
                      height={20}
                    />
                    Sign in with 42 Intra
                  </>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}