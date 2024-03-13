# FILEPATH: /workspaces/FileDroplet/backend/tests/test_main.py

from fastapi.testclient import TestClient
from fastapi import status
from app.main import app
from app import crud, models
from app.database import SessionLocal
import time

client = TestClient(app)


def test_read_file_not_found(db):
    response = client.get("/api/files/999999")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "File not found"}


def test_read_file_expired(db):
    expired_file = crud.create_file(
        db,
        models.File(
            file_name="test", url="http://test.com", expiration=time.time() - 1
        ),
    )
    print(expired_file.id)
    response = client.get(f"/api/files/{expired_file.id}")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "File expired"}


def test_read_file_access_denied(db):
    protected_file = crud.create_file(
        db,
        models.File(
            file_name="test",
            url="http://test.com",
            access_password="password",
            manage_password="password",
        ),
    )
    print(protected_file.id)
    response = client.get(f"/api/files/{protected_file.id}")
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json() == {"detail": "Access denied"}


def test_read_file_success(db):
    file = crud.create_file(db, models.File(file_name="test", url="http://test.com"))
    print(file.id)
    response = client.get(f"/api/files/{file.id}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["file_name"] == "test"
    assert response.json()["url"] == "http://test.com"


if __name__ == "__main__":
    db = SessionLocal()
    test_read_file_not_found(db)
    test_read_file_expired(db)
    test_read_file_access_denied(db)
    test_read_file_success(db)
