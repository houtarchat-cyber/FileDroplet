'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { getFileIcon } from "@/lib/utils2";
import { Eye } from "lucide-react";
import { fileSize } from "@/lib/utils";


export default function CollectionViewer() {
  const [files, setFiles] = useState<Array<{
    id: number;
    file_name: string;
    size: number;
  }>>([]);
  const [auth, setAuth] = useState({
    authCode: "",
    passwordError: false
  })

  const getCollectionInformation = async () => {
    const collectionId = window.location.hash.split("/")[2]
    const response = await fetch(`http://localhost:3758/api/collections/${collectionId}`, {
      headers: {
        "Access-Password": auth.authCode
      },
    })
    const data = await response.json()
    if (response.status === 403) {
      setAuth({ authCode: "", passwordError: true })
      return
    }
    setFiles(data.files)
  }

  return files?.length === 0 ? (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold leading-none">需要访问权限</h2>
      </CardHeader>
      {
        auth.passwordError && (
          <CardContent>
            <p className="text-sm text-destructive">访问密码错误，请重试</p>
          </CardContent>
        )
      }
      <CardContent>
        <div className="grid gap-4">
          <p className="text-sm">请输入访问密码以查看文件</p>
          <InputOTP maxLength={6} value={auth.authCode}
            onChange={(code) => setAuth({ ...auth, authCode: code, passwordError: false })}
            onComplete={() => getCollectionInformation()}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardHeader className="pb-0">
        <div className="grid gap-2">
          <h2 className="text-lg font-bold leading-none">文件列表</h2>
          <p className="text-sm">共 {files?.length} 个文件</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 p-0">
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {
              files?.map((file, index) => (
                <div key={index} className="flex items-center p-4 space-x-4">
                  {getFileIcon(file.file_name)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium leading-none truncate">{file.file_name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">#{file.id} · {file.file_name.split('.').pop()?.toUpperCase()} · {fileSize(file.size)}</div>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="gap-1">
                        <Eye className="w-4 h-4" />
                        <div>查看</div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="min-w-[21rem]">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">访问链接：</span>
                        <a
                          href={`${location.origin}/#/files/${file.id}`}
                          className="text-sm font-semibold text-primary"
                        >
                          {`${location.origin}/#/files/${file.id}`}
                        </a>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              ))
            }
          </div>
        </div>
      </CardContent >
    </Card >
  )
}