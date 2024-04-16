import time

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine
from .oss import generate_signature

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/api/files", response_model=schemas.File)
def create_file(
    file: schemas.FileCreate,
    db: Session = Depends(get_db),
):
    return crud.create_file(
        db=db,
        file=schemas.FileCreate(
            file_name=file.file_name,
            size=file.size,
            url=file.url,
            description=file.description,
            expiration=file.expiration,
            manage_password=file.manage_password,
            access_password=file.access_password,
        ),
    )


@app.get("/api/files/{file_id}", response_model=schemas.File)
def read_file(
    file_id: int, access_password: str = Header(None), db: Session = Depends(get_db)
):
    db_file = crud.get_file(db, file_id=file_id)
    if db_file is None:
        raise HTTPException(status_code=404, detail="File not found")
    if db_file.expiration and db_file.expiration < time.time():
        raise HTTPException(status_code=404, detail="File expired")
    if db_file.access_password != "" and db_file.access_password != access_password:
        raise HTTPException(status_code=403, detail="Access denied")
    db_file.manage_password = None
    return db_file


@app.get("/api/files/{file_id}/summary", response_model=schemas.FileSummary)
def read_file_summary(
    file_id: int, db: Session = Depends(get_db)
):
    db_file = crud.get_file(db, file_id=file_id)
    if db_file is None:
        raise HTTPException(status_code=404, detail="File not found")
    if db_file.expiration and db_file.expiration < time.time():
        raise HTTPException(status_code=404, detail="File expired")
    return {
        "id": db_file.id,
        "file_name": db_file.file_name,
        "size": db_file.size,
    }


@app.put("/api/files/{file_id}", response_model=schemas.File)
def update_file(
    file_id: int,
    file: schemas.FileCreate,
    manage_password: str = Header(None),
    db: Session = Depends(get_db),
):
    db_file = crud.get_file(db, file_id=file_id)
    if db_file is None:
        raise HTTPException(status_code=404, detail="File not found")
    if db_file.manage_password != "" and db_file.manage_password != manage_password:
        raise HTTPException(status_code=403, detail="Manage password error")
    return crud.update_file(
        db=db,
        file_id=file_id,
        file=schemas.FileCreate(
            file_name=file.file_name,
            url=file.url,
            size=file.size,
            description=file.description,
            expiration=file.expiration,
            manage_password=file.manage_password,
            access_password=file.access_password,
        ),
    )


@app.delete("/api/files/{file_id}")
def delete_file(
    file_id: int, manage_password: str = Header(None), db: Session = Depends(get_db)
):
    db_file = crud.get_file(db, file_id=file_id)
    if db_file is None:
        raise HTTPException(status_code=404, detail="File not found")
    if db_file.manage_password != "" and db_file.manage_password != manage_password:
        raise HTTPException(status_code=403, detail="Manage password error")
    crud.delete_file(db=db, file_id=file_id)
    return {"detail": "File deleted"}


@app.post("/api/collections", response_model=schemas.Collection)
def create_collection(
    collection: schemas.CollectionCreate,
    db: Session = Depends(get_db),
):
    return crud.create_collection(
        db=db,
        collection=collection,
        files=[crud.get_file(db, file_id=file_id) for file_id in collection.files],
    )


@app.get("/api/collections/{collection_id}", response_model=schemas.Collection)
def read_collection(
    collection_id: int,
    access_password: str = Header(None),
    db: Session = Depends(get_db),
):
    db_collection = crud.get_collection(db, collection_id=collection_id)
    if db_collection is None:
        raise HTTPException(status_code=404, detail="Collection not found")
    if (
        db_collection.access_password != ""
        and db_collection.access_password != access_password
    ):
        raise HTTPException(status_code=403, detail="Access denied")
    return db_collection


@app.get("/api/oss/signature", response_model=schemas.OssSignature)
def get_oss_signature():
    return generate_signature()


@app.post("/api/feedback", response_model=schemas.Feedback)
def create_feedback(feedback: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    return crud.create_feedback(db=db, feedback=feedback)


@app.get("/api/feedbacks", response_model=list[schemas.Feedback])
def read_feedbacks(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    feedbacks = crud.get_feedbacks(db, skip=skip, limit=limit)
    return feedbacks
