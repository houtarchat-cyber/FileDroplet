import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { History, Trash2 } from "lucide-react"
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Link } from 'react-router-dom';
import { getFileIcon } from '@/lib/utils2';
import { fileSize } from '@/lib/utils';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch } from 'react-redux';
import { removeFile } from '@/store/uploadHistoryFiles';
import { removeCollection } from "@/store/uploadHistoryCollections";

const truncate = (str: string, length: number) => {
  let { res, len } = str.split('').reduce(({ len, res }, char) => {
    const charLen = char.charCodeAt(0) <= 0x007f ? 1 : 2;
    return { len: len + charLen, res: len < length ? res + char : res };
  }, { len: 0, res: '' });
  return res + (len > length ? '...' : '');
};

export default function HistoryPage() {
  const historyFiles = useSelector((state: RootState) => state.uploadHistoryFiles)
  const historyCollections = useSelector((state: RootState) => state.uploadHistoryCollections)
  const dispatch = useDispatch()

  return (
    <div className="grid gap-4">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Link to="#" title="历史记录"
            className="flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
            <History className="h-6 w-6" />
          </Link>
        </HoverCardTrigger>
        <HoverCardContent className="min-w-[26rem]">
          <Tabs defaultValue="files">
            <TabsList>
              <TabsTrigger value="files">文件</TabsTrigger>
              <TabsTrigger value="collections">集合</TabsTrigger>
            </TabsList>
            <TabsContent value="files">
              <ScrollArea className="h-[50vh]">
                <div className="grid gap-4 p-0">
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {
                      historyFiles?.map((file, index) => (
                        <div key={index} className="flex items-center p-4 space-x-4">
                          {getFileIcon(file.name)}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium leading-none truncate">{truncate(file.name, 15)}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">#{file.id} · {file.name.split('.').pop()?.toUpperCase()} · {fileSize(file.size)}</div>
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="gap-1">
                                <Eye className="w-4 h-4" />
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
                              {
                                file.password && (
                                  <div className="flex items-center space-x-2 mt-2">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">访问密码：</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{file.password}</span>
                                  </div>
                                )
                              }
                            </PopoverContent>
                          </Popover>
                          <Button variant="outline" className="gap-1 border-red-400 text-red-400 hover:border-red-500 hover:text-red-500" onClick={() => {
                            dispatch(removeFile(file.id))
                          }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="collections">
              <ScrollArea className="h-[50vh]">
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {
                    historyCollections.map((collection, index) => (
                      <div key={index} className="flex items-center p-4 space-x-4">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium leading-none truncate">{truncate(collection.files.join('、'), 10)}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">等 {collection.files.length} 个文件</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">#{collection.id} · {collection.password}</div>
                        </div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="gap-1">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="min-w-[24rem]">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400">访问链接：</span>
                              <a
                                href={`${location.origin}/#/collections/${collection.id}`}
                                className="text-sm font-semibold text-primary"
                              >
                                {`${location.origin}/#/collections/${collection.id}`}
                              </a>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400">访问密码：</span>
                              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{collection.password}</span>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <Button variant="outline" className="gap-1 border-red-400 text-red-400 hover:border-red-500 hover:text-red-500" onClick={() => {
                          dispatch(removeCollection(collection.id))
                        }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  }
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}