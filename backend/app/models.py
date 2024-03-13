from sqlalchemy import Column, Integer, String

from .database import Base


class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String)
    url = Column(String)
    description = Column(String, default="")
    expiration = Column(Integer, default=0)
    manage_password = Column(String, default="")
    access_password = Column(String, default="")


class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, index=True)
    content = Column(String)
