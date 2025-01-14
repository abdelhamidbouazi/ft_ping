
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { TsParticles } from '@/components/tsParticles'
import { ToastContainer } from 'react-toastify'
import { DataProvider } from '@/components/Play/context'
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ping Pong',
  description: 'Created by abouazi, anaji-el, iqabbal, atabiti, amrakib',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode}) 
{
  return (
    <html lang="en" className=''>
      <body className={inter.className}>
        <main className='flex flex-row '>
          <section className='z-0 '>
            <TsParticles />
          </section>
          <section className='w-full h-full z-10 '>
            <DataProvider>
              <Providers >{children}</Providers>
              <ToastContainer position="bottom-center" />
            </DataProvider>
          </section>
        </main>
      </body>
    </html>
  )
}