'use client';

import { Button } from "@/components/ui/button";
import { CardContent, Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { ImageUp, Loader2, ClipboardCopy } from "lucide-react"
import React, { useEffect, useRef, useState } from "react";
import { uploadImage } from "@/lib/utils";


export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState('');
  const [fileName, setFileName] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleUpload(e.dataTransfer.files[0]);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleUpload(e.target.files[0]);
    }
  }

  const handleUpload = (imageFile: File) => {
    setUploading(true);
    setFileName(imageFile.name.replace(/\.[^/.]+$/, ""));
    uploadImage(imageFile).then((url) => {
      setUploading(false);
      setUploadResult(url);
    }).catch(() => {
      setUploading(false);
    });
  }

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const clipboardData = e.clipboardData || (window as any).clipboardData;
      const item = clipboardData.items[0];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          handleUpload(file);
        }
      }
    }
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    }
  }, []);

  return (
    <Card>
      <div className="flex items-center justify-center w-full h-60 border-dashed border-2 border-gray-200 rounded-lg dark:border-gray-800">
        <div className="flex flex-col items-center space-y-2 p-4 md:p-24 lg:p-48" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
          <ImageUp className="w-12 h-12" />
          <span className="font-semibold text-sm text-gray-500 dark:text-gray-400">拖放文件到此处 或 粘贴剪贴板中的图片</span>
          <Input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} id="file-input" ref={fileInputRef} />
          <Label htmlFor="file-input">
            <Button size="sm" onClick={
              () => fileInputRef.current?.click()
            }>选择文件</Button>
          </Label>
        </div>
      </div>
      {
        uploading && !uploadResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-[80vw] mx-auto">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <span className="text-sm text-gray-500 dark:text-gray-400">正在上传</span>
            </div>
          </div>
        )
      }
      {
        uploadResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <Card className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-[80vw] mx-auto">
              <CardHeader>
                <CardTitle>上传完成</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {
                      [
                        ['图片直链', uploadResult],
                        ['HTML', `<img src="${uploadResult}" alt="${fileName}" title="${fileName}" />`],
                        ['BBCode', `[img]${uploadResult}[/img]`],
                        ['Markdown', `![${fileName}](${uploadResult})`],
                        ['带链接的Markdown', `[![${fileName}](${uploadResult})](${uploadResult})`],
                      ].map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell>{key}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-4">
                              <input type="text" className="w-full rounded-lg border bg-card text-card-foreground shadow-sm p-4" value={value} readOnly />
                              <Button onClick={
                                () => {
                                  navigator.clipboard.writeText(value)
                                }
                              }>
                                <ClipboardCopy className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-end mt-4">
                  <Button size="sm" variant="ghost" onClick={() => {
                    setUploadResult('');
                    setFileName('');
                  }}>关闭</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )
      }
    </Card>
  )
}
