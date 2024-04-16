from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from .database import Base


file_collection = Table(
    "file_collection",
    Base.metadata,
    Column("file_id", Integer, ForeignKey("files.id")),
    Column("collection_id", Integer, ForeignKey("collections.id")),
)

class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String)
    url = Column(String)
    size = Column(Integer)
    description = Column(String, default="")
    expiration = Column(Integer, default=0)
    manage_password = Column(String, default="")
    access_password = Column(String, default="")
    collections = relationship("Collection", secondary=file_collection, back_populates="files")


class Collection(Base):
    __tablename__ = "collections"

    id = Column(Integer, primary_key=True, index=True)
    access_password = Column(String, default="")
    files = relationship("File", secondary=file_collection, back_populates="collections")


class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, index=True)
    content = Column(String)
