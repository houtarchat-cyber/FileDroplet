'use client';

import { Button } from "@/components/ui/button";
import { CardContent, Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash, Upload } from "lucide-react";
import React, { useState } from "react";
import { uploadFile, truncate, IdEncoder } from "@/lib/utils";
import { addFile } from "@/store/uploadHistoryFiles"
import { useDispatch } from "react-redux";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Turnstile } from "@marsidev/react-turnstile";


export default function TextUploader() {
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<number>();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const dispatch = useDispatch();

  const handleUpload = (turnstileToken: string) => {
    if (!turnstileToken || !text) {
      return;
    }
    const textFile = new File([text], '新建文本.txt', {
      type: 'text/plain',
    });
    uploadFile(textFile, textFile.name, textFile.size, truncate(text, 50), '', '', turnstileToken).then((id) => {
      setUploading(false);
      setUploadResult(id);
      dispatch(addFile({
        id: id.toString(),
        name: textFile.name,
        size: textFile.size,
        password: '',
      }));
    }).catch(() => {
      setUploading(false);
    });
  }

  return (
    <Card>
      <CardContent className="space-y-4 min-w-[30rem]">
        <Textarea
          className="w-full mt-4"
          value={text}
          placeholder="输入文本"
          rows={10}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <div className="flex items-center justify-end mt-4 space-x-4 gap-4">
          <Button size="sm" variant="ghost" onClick={() => {
            setText('');
          }}>
            <Trash className="w-4 h-4 mr-2" />
            清空
          </Button>
          <Button size="sm" disabled={uploading} onClick={() => {
            setUploading(true);
          }}>
            {
              uploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )
            }
            上传
          </Button>
        </div>
      </CardContent>
      {
        uploading && !uploadResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-[80vw] mx-auto">
              {
                turnstileToken ? (
                  <>
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">正在上传</span>
                  </>
                ) : (
                  <Turnstile siteKey="0x4AAAAAAAXsCSm8dUb-JlES"
                    onSuccess={
                      (token) => {
                        setTurnstileToken(token);
                        handleUpload(token);
                      }}
                    options={{
                      size: 'compact',
                      theme: 'light',
                    }}
                  />
                )
              }
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
                    <TableRow>
                      <TableCell>文件 ID: {IdEncoder.encodeId(uploadResult)}</TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger>
                            <Button size="sm" variant="outline">查看</Button>
                          </PopoverTrigger>
                          <PopoverContent className="min-w-[21rem]">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400">访问链接：</span>
                              <a
                                href={`${location.origin}/#/files/${IdEncoder.encodeId(uploadResult)}`}
                                className="text-sm font-semibold text-primary"
                              >
                                {`${location.origin}/#/files/${IdEncoder.encodeId(uploadResult)}`}
                              </a>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-end mt-4">
                  <Button size="sm" variant="ghost" onClick={() => {
                    setUploadResult(undefined);
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
