'use client';

import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { UploadCloud, File, Trash, Upload } from "lucide-react"
import React, { useEffect, useState } from "react";
import { uploadCollection, uploadFile, fileSize } from "@/lib/utils";


export default function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploadIndex, setUploadIndex] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(-1);
  const [fileIds, setFileIds] = useState<number[]>([]);
  const [filesInfo, setFilesInfo] = useState<{
    [index: number]: {
      name: string;
      description: string;
      expire: string;
      password: string;
    }
  }>([]);
  const [collectionInfo, setCollectionInfo] = useState<{
    password: string;
    id: number;
  } | null>(null);

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

  const handleUpload = (filesInfoP: typeof filesInfo) => {
    setUploadProgress(0);
    Promise.all(files.map(async (file, index) => {
      const id = await uploadFile(file, filesInfoP[index].name, file.size, filesInfoP[index].description, filesInfoP[index].expire, filesInfoP[index].password);
      fileIds[index] = id;
      setFileIds(fileIds);
      setUploadProgress(uploadProgress + 1);
    })).then(() => {
      setUploadProgress(-1);
      setUploaded(true);
      if (files.length > 1) {
        uploadCollection(fileIds).then(([password, id]) => {
          setCollectionInfo({ password, id });
        });
      }
    });
  }

  const handlePagination = (direction: 'previous' | 'next' | 'upload') => {
    const fileExtension = files[uploadIndex].name.split('.').pop() ?? '';
    const currentFileName = (document.getElementById('file-name') as HTMLInputElement).value;
    const filesInfoP = {
      ...filesInfo,
      [uploadIndex]: {
        name: currentFileName + (
          currentFileName.includes(fileExtension) ? '' : `.${fileExtension}`
        ),
        description: (document.getElementById('file-description') as HTMLTextAreaElement).value,
        expire: (document.getElementById('file-expire') as HTMLInputElement).value,
        password: (document.getElementById('file-password') as HTMLInputElement).value,
      },
    }
    setFilesInfo(filesInfoP);
    if (direction === 'upload') {
      handleUpload(filesInfoP);
      setUploading(false);
      return;
    }
    setUploadIndex(direction === 'previous' ? uploadIndex - 1 : uploadIndex + 1);
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const clipboardData = e.clipboardData || (window as any).clipboardData;
      setFiles(files.concat(Array.from(clipboardData.files)));
    }
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    }
  }, [files]);

  return (
    <Card>
      <div className="flex items-center justify-center w-full h-60 border-dashed border-2 border-gray-200 rounded-lg dark:border-gray-800">
        <div className="flex flex-col items-center space-y-2 p-4 md:p-24 lg:p-48" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
          <UploadCloud className="w-12 h-12" />
          <span className="font-semibold text-sm text-gray-500 dark:text-gray-400">拖放文件到此处 或 粘贴剪贴板中的文件</span>
          <Input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} id="file-input" />
          <Label htmlFor="file-input">
            <Button size="sm" onClick={
              () => document.getElementById('file-input')?.click()
            }>选择文件</Button>
          </Label>
        </div>
      </div>
      {files.length > 0 && (
        <><CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {files.map((file, index) => (
              <div key={index} className="flex items-center space-x-2">
                <File className="w-8 h-8" />
                <div className="flex flex-col space-y-1.5">
                  <span className="font-medium text-sm leading-none">{file.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{(fileSize(file.size))}</span>
                </div>
                <Button className="ml-auto" size="sm" variant="ghost" onClick={() => handleDelete(index)}>
                  <Trash className="w-4 h-4" />
                  <span className="sr-only">删除</span>
                </Button>
              </div>
            ))}
          </div>
        </CardContent><div className="flex items-center justify-end p-4">
          <Button size="sm" onClick={() => setUploading(true)}>
            <Upload className="h-4 w-4 mr-2" />
              上传
          </Button>
        </div></>
      )}
      {
        uploading && (
          <div key={uploadIndex} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-[80vw] mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">上传文件</h2>
              <Label className="text-sm font-medium leading-none" htmlFor="file-name">文件名</Label>
              <Input
                type="text"
                id="file-name"
                placeholder="文件名"
                defaultValue={filesInfo[uploadIndex]?.name ?? files[uploadIndex].name}
                className="w-full p-2 border border-gray-200 rounded-lg dark:border-gray-800"
              />
              <Label className="text-sm font-medium leading-none" htmlFor="file-description">描述</Label>
              <Textarea
                id="file-description"
                placeholder="文件的描述，可以为空。"
                defaultValue={filesInfo[uploadIndex]?.description ?? ''}
                className="w-full p-2 border border-gray-200 rounded-lg dark:border-gray-800"
              />
              <Label className="text-sm font-medium leading-none" htmlFor="file-expire">过期时间</Label>
              <Input
                type="datetime-local"
                id="file-expire"
                defaultValue={filesInfo[uploadIndex]?.expire ?? ''}
                className="w-full p-2 border border-gray-200 rounded-lg dark:border-gray-800"
              />
              <Label className="text-sm font-medium leading-none" htmlFor="file-password">访问密码</Label>
              <Input
                type="text"
                id="file-password"
                placeholder="访问密码，可以为空。"
                defaultValue={filesInfo[uploadIndex]?.password ?? ''}
                className="w-full p-2 border border-gray-200 rounded-lg dark:border-gray-800"
              />
              <div className="flex items-center justify-end gap-4 mt-4">
                <Button size="sm" variant="ghost" onClick={() => setUploading(false)}>
                  取消
                </Button>
                {uploadIndex > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handlePagination('previous')}
                  >
                    上一个
                  </Button>
                )}
                {uploadIndex < files.length - 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handlePagination('next')}
                  >
                    下一个
                  </Button>
                )}
                {uploadIndex === files.length - 1 && (
                  <Button
                    size="sm"
                    onClick={() => handlePagination('upload')}
                  >
                    上传
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
      }
      {
        uploadProgress >= 0 && !uploaded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-[80vw] mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">上传进度</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">正在上传第 {uploadProgress + 1} 个文件（共 {files.length} 个）</span>
              <Progress className="w-full mt-4" value={uploadProgress} />
              <div className="flex items-center justify-end mt-4">
                <Button size="sm" variant="ghost" onClick={() => setUploadProgress(-1)}>关闭</Button>
              </div>
            </div>
          </div>
        )
      }
      {
        uploaded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-[80vw] mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">上传完成</h2>
              {
                collectionInfo && (
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">您的文件已上传完成，您可以通过以下链接访问：</span>
                    <div className="flex items-center space-x-2 mt-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">访问密码：</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{collectionInfo.password}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">访问链接：</span>
                      <a
                        href={`${location.origin}/#/collections/${collectionInfo.id}`}
                        className="text-sm font-semibold text-primary"
                      >
                        {`${location.origin}/#/collections/${collectionInfo.id}`}
                      </a>
                    </div>
                  </div>
                )
              }
              <Table>
                <TableBody>
                  {files.map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>文件 ID: {fileIds[index]}</TableCell>
                      <TableCell>{filesInfo[index].name}</TableCell>
                      {
                        filesInfo[index].password && (
                          <TableCell>{filesInfo[index].password}</TableCell>
                        )
                      }
                      <TableCell>
                        <Popover>
                          <PopoverTrigger>
                            <Button size="sm" variant="outline">查看</Button>
                          </PopoverTrigger>
                          <PopoverContent className="min-w-[21rem]">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400">访问链接：</span>
                              <a
                                href={`${location.origin}/#/files/${fileIds[index]}`}
                                className="text-sm font-semibold text-primary"
                              >
                                {`${location.origin}/#/files/${fileIds[index]}`}
                              </a>
                            </div>
                            {
                              filesInfo[index].password && (
                                <div className="flex items-center space-x-2 mt-2">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">访问密码：</span>
                                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{filesInfo[index].password}</span>
                                </div>
                              )
                            }
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-end mt-4">
                <Button size="sm" variant="ghost" onClick={() => {
                  setUploadProgress(-1);
                  setUploaded(false);
                }}>关闭</Button>
              </div>
            </div>
          </div>
        )
      }
    </Card>
  )
}
