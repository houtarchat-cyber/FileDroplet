import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings } from "lucide-react"
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setBackendUrl } from "@/store/settings"
import { useRef } from "react"


export default function SettingsDialog() {
  const backendUrl: string = useSelector((state: RootState) => state.settings.backendUrl)
  const dispatch = useDispatch()
  if (!backendUrl) {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      dispatch(setBackendUrl("//localhost:3758"))
    } else {
      dispatch(setBackendUrl("//fdl-api.houtar.eu.org"))
    }
  }
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Link to="#"
          title="设置"
          className="flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
          <Settings className="h-6 w-6" />
        </Link>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>设置</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="backendUrl" className="text-right">
              后端地址
            </Label>
            <Input
              id="backendUrl"
              defaultValue={backendUrl}
              className="col-span-3"
              ref={inputRef}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={
              () => {
                let url = inputRef.current?.value ?? ''
                if (url.endsWith('/')) {
                  url = url.slice(0, -1)
                }
                dispatch(setBackendUrl(url))
              }
            }>保存</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}