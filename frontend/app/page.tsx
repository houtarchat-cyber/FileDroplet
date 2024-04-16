'use client';

import { Link, HashRouter as Router, Route, Routes } from "react-router-dom"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import ImageUploader from "@/components/ImageUploader"
import FileUploader from "@/components/FileUploader"
import FeedbackPage from "@/components/Feedback"
import FileViewer from "@/components/FileViewer"
import CollectionViewer from "@/components/CollectionViewer"
import Footer from "@/components/Footer"
import Icon from "@/app/icon.webp"


export default function Page() {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        <header className="flex items-center h-16 border-b p-4">
          <div className="flex items-center flex-1">
            <Image src={Icon} alt="FileDroplet" className="h-14 w-14 mr-2" />
            <Link
              to="/"
              className="text-xl font-semibold" 
              style={{ 
                transition: 'text-shadow 0.2s ease', 
                textShadow: 'none' 
              }}
              onMouseOver={(event) => event.currentTarget.style.textShadow = '0 5px 15px rgba(0,0,0,0.3)'}
              onMouseOut={(event) => event.currentTarget.style.textShadow = 'none'}
            >
              FileDroplet
            </Link>
          </div>
          <Navbar />
        </header>
        <main className="flex-1 flex flex-col items-center justify-center p-4 gap-4">
          <Routes>
            <Route path="/" element={<FileUploader />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/image" element={<ImageUploader />} />
            <Route path="/files/:id" element={<FileViewer />} />
            <Route path="/collections/:id" element={<CollectionViewer />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}