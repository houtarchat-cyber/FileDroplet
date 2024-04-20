import { File, FileArchive, FileAudio, FileCode, FileImage, FilePieChart, FileSpreadsheet, FileText, FileType, FileVideo } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Document, Page } from 'react-pdf';

export const getFileIcon = (fileName: string, size?: string) => {
  size = size || 'w-4 h-4';
  switch (fileName.split('.').pop()?.toLowerCase()) {
  case 'zip':
  case 'rar':
  case '7z':
  case 'tar':
    return <FileArchive className={size} />;
  case 'wav':
  case 'bwf':
  case 'ape':
  case 'flac':
  case 'alac':
  case 'wv':
  case 'mp3':
  case 'aac':
  case 'ogg':
  case 'opus':
    return <FileAudio className={size} />;
  case 'xls':
  case 'xlsx':
    return <FileSpreadsheet className={size} />;
  case 'ppt':
  case 'pptx':
    return <FilePieChart className={size} />;
  case 'doc':
  case 'docx':
    return <FileType className={size} />;
  case 'bmp':
  case 'iff':
  case 'ilbm':
  case 'tiff':
  case 'tif':
  case 'png':
  case 'gif':
  case 'jpeg':
  case 'jpg':
  case 'mng':
  case 'xpm':
  case 'psd':
  case 'sai':
  case 'psp':
  case 'ufo':
  case 'xcf':
  case 'pcx':
  case 'ppm':
  case 'webp':
  case 'ps':
  case 'eps':
  case 'ai':
  case 'fh':
  case 'swf':
  case 'fla':
  case 'svg':
  case 'wmf':
  case 'dxf':
  case 'cgm':
  case 'ico':
    return <FileImage className={size} />;
  case 'flv':
  case 'avi':
  case 'wmv':
  case 'asf':
  case 'wmvhd':
  case 'dat':
  case 'vob':
  case 'mpg':
  case 'mpeg':
  case 'mp4':
  case '3gp':
  case '3g2':
  case 'mkv':
  case 'rm':
  case 'rmvb':
  case 'mov':
  case 'qt':
  case 'ogv':
  case 'oga':
  case 'mod':
  case 'webm':
    return <FileVideo className={size} />;
  case 'pdf':
    return <FileText className={size} />;
  case 'txt':
  case 'html':
    return <FileCode className={size} />;
  default:
    return <File className={size} />;
  }
}

const RcDPlayer = dynamic(
  () => import('rc-dplayer').then((mod) => mod.Player),
  { 
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center">加载中...</div>,
  }
);

export function PreviewFile({ url }: { url: string }) {
  const ext = new URL(url).pathname.split('.').pop()?.toLowerCase();
  switch (ext) {
  case 'pdf':
    return <Document file={url} className="w-full h-full">
      <Page pageNumber={1} />
    </Document>
  case 'doc':
  case 'docx':
  case 'xls':
  case 'xlsx':
  case 'ppt':
  case 'pptx':
    return <iframe src={`https://office.yueedu.com/op/view.aspx?src=${encodeURIComponent(url)}`} className="w-full h-full" />
  case 'jpg':
  case 'jpeg':
  case 'png':
  case 'bmp':
  case 'gif':
  case 'ico':
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} className="max-h-[75%] m-auto" alt="" />
  case 'txt':
  case 'html':
    return <object type="text/plain" data={url} className="w-full h-full" />
  case '3gp':
  case 'mp4':
  case 'webm':
  case 'm3u8':
  case 'flv':
    return <RcDPlayer
      src={url}
      options={{
        autoplay: true,
        screenshot: true,
        hotkey: true,
        preload: 'auto',
        volume: 0.5,
        mutex: true,
        video: {
          pic: '',
        },
      }}
    />
  case 'mp3':
  case 'ogg':
  case 'wav':
    return <audio controls src={url} className="w-full">
      <source src={url} type={
        ext === 'mp3' ? 'audio/mpeg' : ext === 'ogg' ? 'audio/ogg' : ext === 'wav' ? 'audio/wav' : ''
      } />
    </audio>
  default:
    return <>当前资源不支持在线预览，请<Link href={url}>下载</Link>后查看</>
  }
}