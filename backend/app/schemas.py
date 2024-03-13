from pydantic import BaseModel


class FileBase(BaseModel):
    file_name: str
    url: str
    description: str = ""
    expiration: int = 0

    class Config:
        from_attributes = True


class FileAccess(FileBase):
    manage_password: str = ""
    access_password: str = ""


class FileCreate(FileAccess):
    url: str


class File(FileBase):
    id: int


class OssSignature(BaseModel):
    access_key_id: str
    host: str
    policy: str
    signature: str
    bucket: str
    expire: str
    dir: str
    key: str


class FeedbackBase(BaseModel):
    name: str = ""
    email: str = ""
    content: str


class FeedbackCreate(FeedbackBase):
    pass


class Feedback(FeedbackBase):
    id: int

    class Config:
        from_attributes = True
