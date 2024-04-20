'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { fileSize, getBackendUrl } from "@/lib/utils";
import { getFileIcon, PreviewFile } from "@/lib/utils2";
import { ClipboardCopy, Download, Eye, FileClock, LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { pdfjs } from 'react-pdf';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export default function FileViewer() {
  const [file, setFile] = useState({
    file_name: "",
    size: 0,
    description: "",
    expires: "",
    url: ""
  })
  const [auth, setAuth] = useState({
    needAuth: false,
    authCode: "",
    passwordError: false
  })

  const getFileInformation = async (first?: boolean) => {
    const fileId = window.location.hash.split("/")[2]
    const response = await fetch(getBackendUrl(`/api/files/${fileId}`), {
      headers: auth.authCode ? {
        "Access-Password": auth.authCode
      } : {},
    })
    const data = await response.json()
    if (response.status === 403) {
      setAuth({ ...auth, needAuth: true, passwordError: !first })
      return
    }
    setFile(data)
  }

  useEffect(() => {
    getFileInformation(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return auth.needAuth ? (
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
          <Input type="password" placeholder="访问密码" value={auth.authCode} onChange={
            (e) => {
              setAuth({ ...auth, authCode: e.target.value, passwordError: false })
            }
          } />
          <Button onClick={
            async () => {
              setAuth({ ...auth, needAuth: false })
              getFileInformation()
            }
          }>提交</Button>
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardHeader className="pb-0">
        <div className="grid gap-2">
          {
            file.file_name ? (
              <h2 className="text-lg font-bold leading-none">{file.file_name}</h2>
            ) : (
              <Skeleton className="w-1/2 h-6" />
            )
          }
          <p className="text-sm font-medium flex items-center gap-1 pb-3">
            {
              file.file_name ? (
                <>
                  {getFileIcon(file.file_name)}
                  {`${file.file_name.split('.').pop()?.toUpperCase()} · ${fileSize(file.size)}`}
                </>
              ) : (
                <>
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="w-1/4 h-4" />
                </>
              )
            }
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-4">
          {
            file.description && (
              <div>
                <p className="text-sm">{file.description}</p>
              </div>
            )
          }
          <div className="border-t pt-4 grid gap-2">
            <div className="flex items-center gap-2">
              <FileClock className="w-4 h-4" />
              <div className="text-sm">
                {
                  file.expires ? (
                    <p className="text-sm">链接将于 {new Date(file.expires).toLocaleString()} 过期</p>
                  ) : (
                    <p className="text-sm">链接永不过期</p>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-end gap-2">
          <Button className="gap-1" onClick={
            () => {
              window.open(file.url, "_blank")
            }
          }>
            <Download className="w-4 h-4" />
            下载
          </Button>
          <Popover>
            <PopoverTrigger>
              <Button className="gap-1" variant="secondary">
                <LinkIcon className="w-4 h-4" />
                获取直链
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex gap-2">
                <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only" htmlFor="file-url">文件直链</Label>
                <input type="text" id="file-url" className="flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors h-9" value={file.url} readOnly />
                <Button onClick={
                  () => {
                    navigator.clipboard.writeText(file.url)
                  }
                }>
                  <ClipboardCopy className="w-4 h-4" />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Dialog>
            <DialogTrigger>
              <Button className="gap-1" variant="secondary">
                <Eye className="w-4 h-4" />
                预览
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[80vw] h-[80vh]">
              <DialogHeader>
                <DialogTitle>文件预览</DialogTitle>
              </DialogHeader>
              <div>
                {
                  file.url ? (
                    PreviewFile({ url: file.url })
                  ) : (
                    <Skeleton className="w-full h-full" />
                  )
                }
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  )
}