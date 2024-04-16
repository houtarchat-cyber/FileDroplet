import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fileSize = (size: number) => {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`;
}

export async function uploadFile(file: File, name: string, size: number, description: string, expire: string, password: string) {
  const signature = await fetch('http://localhost:3758/api/oss/signature').then(res => res.json());
  const formData = new FormData();
  formData.append('key', signature.dir + signature.key + file.name);
  formData.append('policy', signature.policy);
  formData.append('OSSAccessKeyId', signature.access_key_id);
  formData.append('signature', signature.signature);
  formData.append('Content-Disposition', `attachment; filename="${name}"`)
  formData.append('file', file);
  await fetch(signature.host, {
    body: formData,
    headers: {
      'x-oss-object-acl': 'public-read',
    },
    method: 'POST',
  });
  const fileInfo = {
    file_name: name,
    size: size,
    url: `${signature.host}/${signature.dir}${signature.key}${file.name}`,
    description,
    expiration: expire ? new Date(expire).getTime() : 0,
    access_password: password,
  };
  const res = await fetch('http://localhost:3758/api/files', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fileInfo),
  });
  return (await res.json()).id;
}

export async function uploadCollection(fileIds: number[]) {
  const password = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  const res = await fetch('http://localhost:3758/api/collections', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: fileIds,
      access_password: password,
    }),
  });
  return [password, (await res.json()).id];
}

export async function uploadImage(imageFile: File) {
  if (!imageFile.type.startsWith('image/')) {
    alert('请上传图片文件');
    throw -1;
  }
  const signature = await fetch('http://localhost:3758/api/oss/signature').then(res => res.json());
  const formData = new FormData();
  formData.append('key', signature.dir + signature.key + imageFile.name);
  formData.append('policy', signature.policy);
  formData.append('OSSAccessKeyId', signature.access_key_id);
  formData.append('signature', signature.signature);
  formData.append('file', imageFile);
  await fetch(signature.host, {
    body: formData,
    headers: {
      'x-oss-object-acl': 'public-read',
    },
    method: 'POST',
  });
  return `${signature.host}/${signature.dir}${signature.key}${imageFile.name}`;
}
