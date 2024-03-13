# FileDroplet API Documentation :file_folder:

## :file_folder: 文件上传API

- **Endpoint**: `/api/files`
- **Method**: `POST`
- **Description**: 将文件信息保存到数据库，返回文件的 ID
- **Request Body**:
    - `file_name`: 文件的名称
    - `url`: 文件的下载 URL
    - `description`: 文件的描述
    - `expiration`: 文件的过期时间
    - `manage_password`: 文件的管理密码（可选）
    - `access_password`: 文件的访问密码（可选）
- **Response**:
    - `id`: 文件的ID

Request JSON示例：
```json
{
  "file_name": "example.txt",
  "url": "https://examplebucket.oss-cn-hangzhou.aliyuncs.com/exampleobject",
  "description": "This is an example file.",
  "expiration": "1446727949",
  "manage_password": "123456",
  "access_password": "123456"
}
```

Response JSON示例：
```json
{
  "id": 1
}
```

## :arrow_down: 获取指定ID的文件的信息

- **Endpoint**: `/api/files/{file_id}`
- **Method**: `GET`
- **Description**: 返回指定 ID 的文件的信息，如果文件有访问密码，需要在请求头中提供密码
- **Request Headers**:
    - `access_password`: 文件访问密码（如果有的话）
- **Response**:
    - `file_name`: 文件的名称
    - `url`: 文件的下载 URL
    - `description`: 文件的描述
    - `expiration`: 文件的过期时间

Response JSON示例：
```json
{
  "file_name": "example.txt",
  "url": "https://examplebucket.oss-cn-hangzhou.aliyuncs.com/exampleobject",
  "description": "This is an example file.",
  "expiration": "1446727949"
}
```

## :x: 文件删除API

- **Endpoint**: `/api/files/{file_id}`
- **Method**: `DELETE`
- **Description**: 删除指定 ID 的文件，需要在请求头中提供管理密码
- **Request Headers**:
  - `manage_password`: 文件的管理密码

## :speech_balloon: 用户反馈API

- **Endpoint**: `/api/feedback`
- **Method**: `POST`
- **Description**: 提交用户反馈
- **Request Body**:
  - `name`: 用户的名称
  - `email`: 用户的邮箱
  - `content`: 反馈内容

Request JSON示例：
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "content": "I love this platform!"
}
```
