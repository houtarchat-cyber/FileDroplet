'use client';

import { JSX, SVGProps } from "react"
import Navbar from "@/app/components/Navbar"
import FileUploader from "@/app/components/FileUploader"
import Footer from "@/app/components/Footer"

export default function Page() {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center h-14 border-b p-4">
        <div className="flex items-center flex-1">
          <FlagIcon className="h-6 w-6 mr-2" />
          <span className="text-lg font-semibold">FileDroplet</span>
        </div>
        <Navbar />
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-4">
        <FileUploader />
      </main>
      <Footer />
    </div>
  )
}

function FlagIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  )
}