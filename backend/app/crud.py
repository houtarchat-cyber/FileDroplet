from sqlalchemy.orm import Session

from . import models, schemas


def get_file(db: Session, file_id: int):
    return db.query(models.File).filter(models.File.id == file_id).first()


def create_file(db: Session, file: schemas.FileCreate):
    db_file = models.File(
        file_name=file.file_name,
        url=file.url,
        description=file.description,
        expiration=file.expiration,
        manage_password=file.manage_password,
        access_password=file.access_password,
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file


def delete_file(db: Session, file_id: int):
    db_file = db.query(models.File).filter(models.File.id == file_id).first()
    db.delete(db_file)
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
