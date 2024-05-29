import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { store } from "@/store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fileSize = (size: number) => {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`;
}

export function getBackendUrl(path: string) {
  return store.getState().settings.backendUrl + path;
}

export function truncate(str: string, length: number) {
  let { res, len } = str.split('').reduce(({ len, res }, char) => {
    const charLen = char.charCodeAt(0) <= 0x007f ? 1 : 2;
    return { len: len + charLen, res: len < length ? res + char : res };
  }, { len: 0, res: '' });
  return res + (len > length ? '...' : '');
};

export class IdEncoder {
  private static table = 'fod9m21ykr6zqiveah8bt4xspn7j53guwc';
  private static tr = Array.from(this.table).reduce((acc, char, index) => ({ ...acc, [char]: index }), {} as Record<string, number>);
  private static s = [2, 0, 4, 1, 3];
  private static xor = 177451812;
  private static add = 8728348608;

  static encodeId(id: number) {
    if (id >= Math.pow(32, 5)) {
      return id.toString();
    }
    id = (id ^ this.xor) + this.add;
    let r = Array(5).fill('f');
    for (let i = 0; i < 5; i++) {
      r[this.s[i]] = this.table[Math.floor(id / Math.pow(32, i) % 32)];
    }
    return r.join('');
  }

  static decodeId(id: string) {
    if (id.length !== 5) {
      return parseInt(id) || 0;
    }
    let r = 0;
    for (let i = 0; i < 5; i++) {
      r += this.tr[id[this.s[i]]] * Math.pow(32, i);
    }
    return ((r - this.add) ^ this.xor) + 234881024;
  }
}

export async function uploadFile(file: File, name: string, size: number, description: string, expire: string, password: string, turnstileToken: string) {
  const signature = await fetch(getBackendUrl('/api/oss/signature?turnstile_token=' + turnstileToken)).then(res => res.json());
  const formData = new FormData();
  formData.append('key', signature.dir + signature.key + file.name);
  formData.append('policy', signature.policy);
  formData.append('OSSAccessKeyId', signature.access_key_id);
  formData.append('signature', signature.signature);
  formData.append('Content-Disposition', `attachment; filename="${name}"`);
  formData.append('file', file);
  const { ok } = await fetch(signature.host, {
    body: formData,
    headers: {
      'x-oss-object-acl': 'public-read',
    },
    method: 'POST',
  });
  if (!ok) {
    throw new Error('上传失败');
  }
  const fileInfo = {
    file_name: name,
    size: size,
    url: `${signature.host}/${signature.dir}${signature.key}${file.name}`,
    description,
    expiration: expire ? Math.floor(new Date(expire).getTime() / 1000) : 0,
    access_password: password,
  };
  const saveFile: () => Promise<number> = async () => {
    try {
      const res: Response = await Promise.race([
        fetch(getBackendUrl('/api/files'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(fileInfo),
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
      ]) as Response;
      return (await res.json()).id;
    } catch (e) {
      console.error(e);
      return await saveFile();
    }
  }
  return await saveFile();
}

export async function uploadCollection(fileIds: number[]) {
  const password = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  const res = await fetch(getBackendUrl('/api/collections'), {
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

export async function uploadImage(imageFile: File, turnstileToken: string) {
  if (!imageFile.type.startsWith('image/')) {
    alert('请上传图片文件');
    throw -1;
  }
  const signature = await fetch(getBackendUrl('/api/oss/signature?turnstile_token=' + turnstileToken)).then(res => res.json());
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
