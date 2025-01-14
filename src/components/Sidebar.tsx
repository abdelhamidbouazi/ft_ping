"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import axios from "@/app/api/axios";

export function Sidebar() {
  const router = useRouter();
  const iconClasses =
    "flex items-center justify-center flex-shrink-0 w-6 h-6 mt-4 rounded hover:text-slate-200 text-slate-100 ";
  const midnightSecondary = "#5750a6";

  const handleSignOut = async () => {
    try {
      const res = await axios.post(`/auth/logout`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        router.push("/login");
        toast.info("Logged out",
          {
            toastId: 'info1'
        })
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message,
        {
          toastId: 'error1'
      })
    }
  };

  return (
    <div className="flex flex-col items-center w-16 pb-6 pt-2 overflow-auto border-r border-midnight-border bg-midnight gap-5">
      <Link className="hover:bg-slate-200" href="/dashboard">
        <Icon
          color={midnightSecondary}
          icon="solar:home-smile-angle-bold-duotone"
          className={iconClasses}
        />
      </Link>
      <Link href="/game">
        <Icon
          color={midnightSecondary}
          icon="solar:gamepad-bold-duotone"
          className={iconClasses}
        />
      </Link>
      <Link href="/chat">
        <Icon
          color={midnightSecondary}
          icon="solar:chat-dots-bold-duotone"
          className={iconClasses}
        />
      </Link>
      <Link href="/rank">
        <Icon
          color={midnightSecondary}
          icon="solar:ranking-bold-duotone"
          className={iconClasses}
        />
      </Link>
      <Link href="/settings">
        <Icon
          color={midnightSecondary}
          icon="solar:settings-bold-duotone"
          className={iconClasses}
        />
      </Link>

        <button
         className="flex items-center justify-center flex-shrink-0 w-10 h-10 mt-4 mt-auto rounded hover:bg-gray-300"
        onClick={handleSignOut}>
          <Icon
            color={midnightSecondary}
            icon="solar:logout-3-bold-duotone"
            className={iconClasses}
          />
        </button>
    </div>
  );
}