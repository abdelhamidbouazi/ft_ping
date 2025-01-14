"use client";
import { Sidebar } from "@/components/Sidebar";
import { Providers } from "./chat/providers";
import Navbar from "@/components/Navbar";
import { use, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { DataContext, DataProvider } from "../../components/Play/context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let socket;
  const {setGlobalSocket, globalSocket} = useContext(DataContext);
  useEffect(() => {
    socket = io(`${process.env.NEXT_PUBLIC_IP_BACK}`, {
      withCredentials: true,
    });
    setGlobalSocket(socket);
    return () => {
      socket.disconnect();
      if (globalSocket !== null)
        globalSocket.disconnect();
    }
    
  }, []);

  return (
    <>
      <div className="flex w-screen h-screen text-slate-200">
        <Sidebar />
        <div className="flex flex-col flex-grow ">
          <Navbar />
          <div className="flex-grow p-6 overflow-auto">
            <div>
              <Providers>{children}</Providers>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
