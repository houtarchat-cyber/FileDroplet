# FileDroplet API Documentation :file_folder:

## :file_folder: 文件上传API

- **Endpoint**: `/api/files`
- **Method**: `POST`
- **Description**: 将文件信息保存到数据库，返回文件的ID
- **Request Headers**:
    - `Content-Type`: `multipart/form-data`
    - `manage_password`: 文件的管理密码
- **Request Body**:
    - `file_name`: 文件的名称
    - `description`: 文件的描述
    - `expiration`: 文件的过期时间
    - `access_password`: 文件的访问密码（可选）
- **Response**:
    - `file_id`: 文件的ID

Request JSON示例：
```json
{
  "file_name": "example.txt",
  "description": "This is an example file.",
  "expiration": "1446727949"
}
```

Response JSON示例：
```json
{
  "file_id": 1,
  "url": "https://examplebucket.oss-cn-hangzhou.aliyuncs.com/exampleobject"
}
```

## :arrow_down: 获取指定ID的文件的下载URL

- **Endpoint**: `/api/files/{file_id}`
- **Method**: `GET`
- **Description**: 返回指定ID的文件的下载URL，如果文件有访问密码，需要在请求头中提供密码
- **Request Headers**:
    - `access_password`: 文件访问密码（如果有的话）
- **Response**:
    - `download_url`: 文件的下载URL

Response JSON示例：
```json
{
  "download_url": "https://examplebucket.oss-cn-hangzhou.aliyuncs.com/exampleobject"
}
```

## :x: 文件删除API

- **Endpoint**: `/api/files/{file_id}`
- **Method**: `DELETE`
- **Description**: 删除指定ID的文件，需要在请求头中提供管理密码
- **Request Headers**:
  - `manage_password`: 文件的管理密码

## :speech_balloon: 用户反馈API

- **Endpoint**: `/api/feedback`
- **Method**: `POST`
- **Description**: 提交用户反馈
- **Request Body**:
  - `message`: 反馈内容

Request JSON示例：
```json
{
  "message": "I love this platform!"
}
```
