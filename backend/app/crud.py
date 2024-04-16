from sqlalchemy.orm import Session, joinedload

from . import models, schemas


def get_file(db: Session, file_id: int):
    return db.query(models.File).get(file_id)


def create_file(db: Session, file: schemas.FileCreate):
    db_file = models.File(
        file_name=file.file_name,
        url=file.url,
        size=file.size,
        description=file.description,
        expiration=file.expiration,
        manage_password=file.manage_password,
        access_password=file.access_password,
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file


def update_file(db: Session, file_id: int, file: schemas.FileCreate):
    db_file = db.query(models.File).get(file_id)
    db_file.file_name = file.file_name
    db_file.url = file.url
    db_file.size = file.size
    db_file.description = file.description
    db_file.expiration = file.expiration
    db_file.manage_password = file.manage_password
    db_file.access_password = file.access_password
    db.commit()
    db.refresh(db_file)
    return db_file


def delete_file(db: Session, file_id: int):
    db_file = db.query(models.File).get(file_id)
    db.delete(db_file)
    db.commit()


def get_collection(db: Session, collection_id: int):
    return db.query(models.Collection).options(joinedload(models.Collection.files)).get(collection_id)


def create_collection(db: Session, collection: schemas.CollectionCreate, files: list[models.File]):
    db_collection = models.Collection(
        access_password=collection.access_password,
        files=files,
    )
    db.add(db_collection)
    db.commit()
    db.refresh(db_collection)
    return db_collection


def update_collection(db: Session, collection_id: int, collection: schemas.CollectionCreate, files: list[models.File]):
    db_collection = db.query(models.Collection).get(collection_id)
    db_collection.collection_name = collection.collection_name
    db_collection.description = collection.description
    db_collection.manage_password = collection.manage_password
    db_collection.access_password = collection.access_password
    db_collection.files = files
    db.commit()
    db.refresh(db_collection)
    return db_collection


def delete_collection(db: Session, collection_id: int):
    db_collection = db.query(models.Collection).get(collection_id)
    db.delete(db_collection)
    db.commit()


def create_feedback(db: Session, feedback: schemas.FeedbackCreate):
    db_feedback = models.Feedback(
        name=feedback.name, email=feedback.email, content=feedback.content
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback


def get_feedbacks(db: Session, skip: int = 0, limit: int = 10):
    return (
        db.query(models.Feedback)
        .order_by(models.Feedback.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
