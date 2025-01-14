'use client'
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter();
    return (<>
          <main className="flex flex-col items-center justify-center gap-8 md:p-36">
              <h1 className="text-midnight-secondary text-center ">-7AAAAAAAYYYYYEEEEEEDDDD LIIIIYYYYAAAA MN HNAAA- 404 - Page Not Found</h1>
              <Button onPress={()=> {router.push('/dashboard')}}>
                Back to Home
              </Button>
            </main>    
    </>)

  }