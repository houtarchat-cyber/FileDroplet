'use client';

import CollectionViewer from "@/components/CollectionViewer";
import FeedbackPage from "@/components/Feedback";
import RetrievePage from "@/components/Retrieve";
import FileUploader from "@/components/FileUploader";
import FileViewer from "@/components/FileViewer";
import Footer from "@/components/Footer";
import ImageUploader from "@/components/ImageUploader";
import Navbar from "@/components/Navbar";
import TextUploader from "@/components/TextUploader";
import { store, persistor } from "@/store";
import { Provider } from "react-redux";
import { Link, Route, HashRouter as Router, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";


export default function Page() {
  return (
    <Router>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <div className="flex flex-col h-screen">
            <header className="flex items-center h-16 border-b p-4">
              <div className="flex items-center flex-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icon.webp" alt="FileDroplet" className="h-14 w-14 mr-2" />
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
                <Route path="/retrieve" element={<RetrievePage />} />
                <Route path="/image" element={<ImageUploader />} />
                <Route path="/text" element={<TextUploader />} />
                <Route path="/files/:id" element={<FileViewer />} />
                <Route path="/collections/:id" element={<CollectionViewer />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </PersistGate>
      </Provider>
    </Router>
  )
}