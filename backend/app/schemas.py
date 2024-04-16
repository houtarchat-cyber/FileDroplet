from pydantic import BaseModel


class FileBase(BaseModel):
    file_name: str
    url: str
    size: int = 0
    description: str = ""
    expiration: int = 0

    class Config:
        from_attributes = True


class FileAccess(FileBase):
    manage_password: str = ""
    access_password: str = ""


class FileCreate(FileAccess):
    pass


class File(FileBase):
    id: int


class FileSummary(BaseModel):
    id: int
    file_name: str
    size: int

    class Config:
        from_attributes = True


class CollectionBase(BaseModel):

    class Config:
        from_attributes = True


class CollectionAccess(CollectionBase):
    access_password: str = ""

    class Config:
        from_attributes = True


class CollectionCreate(CollectionAccess):
    files: list[int] = []


class Collection(CollectionBase):
    id: int
    files: list[FileSummary] = []

    class Config:
        from_attributes = True


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
