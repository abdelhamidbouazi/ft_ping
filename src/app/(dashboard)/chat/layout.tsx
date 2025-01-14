"use client";
import { Providers } from "./providers";
import RightSection from "@/components/Chat/Layout/RightSection";
import { useParams } from "next/navigation";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ id: string; username: string }>();
  // //console.log(">>", params);
  return (
    <>
      <section className="flex flex-col md:flex-row h-full max-w-screen justify-center md:p-2 ">
        <section className=" md:w-1/4 w-full">
          <RightSection params={params} />
        </section>
        <section className="md:w-3/4 w-full h-full">
          <Providers>{children}</Providers>
        </section>
      </section>
    </>
  );
}
