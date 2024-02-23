'use client';

import {Button} from "@/app/components/ui/button";
import {CardContent, Card} from "@/app/components/ui/card"
import React, {JSX, SVGProps, useState} from "react";

export default function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFiles(files.concat(Array.from(e.dataTransfer.files)));
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(files.concat(Array.from(e.target.files)));
    }
  }

  const handleDelete = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  }

  const fileSize = (size: number) => {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, i)).toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`;
  }

  return (
    <Card>
      <div className="flex items-center justify-center w-full h-60 border-dashed border-2 border-gray-200 rounded-lg dark:border-gray-800">
        <div className="flex flex-col items-center space-y-2 p-4 md:p-24 lg:p-48" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
          <FileIcon className="w-12 h-12" />
          <span className="font-semibold text-sm text-gray-500 dark:text-gray-400">Drag and drop your files</span>
          <input type="file" multiple onChange={handleFileChange} style={{display: 'none'}} id="file-input" />
          <label htmlFor="file-input">
            <Button size="sm" onClick={
              () => document.getElementById('file-input')?.click()
            }>Choose File</Button>
          </label>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {files.map((file, index) => (
            <div key={index} className="flex items-center space-x-2">
              <FileIcon className="w-8 h-8" />
              <div className="flex flex-col space-y-1.5">
                <span className="font-medium text-sm leading-none">{file.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{(fileSize(file.size))}</span>
              </div>
              <Button className="ml-auto" size="sm" variant="ghost" onClick={() => handleDelete(index)}>
                <TrashIcon className="w-4 h-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function FileIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}


function TrashIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}
