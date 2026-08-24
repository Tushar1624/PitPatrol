import os

from dotenv import load_dotenv
from fastapi.testclient import TestClient
from supabase import create_client

from app.main import app

load_dotenv()

client = TestClient(app)


def get_test_access_token():
    supabase = create_client(
        os.getenv("SUPABASE_URL"),
        os.getenv("SUPABASE_KEY"),
    )

    response = supabase.auth.sign_in_with_password(
        {
            "email": os.getenv("TEST_EMAIL"),
            "password": os.getenv("TEST_PASSWORD"),
        }
    )

    return response.session.access_token


def auth_headers():
    token = get_test_access_token()

    return {
        "Authorization": f"Bearer {token}"
    }


def test_health():
    response = client.get("/health")

    assert response.status_code == 200


def test_history():
    response = client.get(
        "/api/history",
        headers=auth_headers(),
    )

    assert response.status_code == 200

    data = response.json()

    assert "items" in data
    assert isinstance(data["items"], list)


def test_history_by_id():
    response = client.get(
        "/api/history/2",
        headers=auth_headers(),
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == 2


def test_history_not_found():
    response = client.get(
        "/api/history/999999",
        headers=auth_headers(),
    )

    assert response.status_code == 404

def test_history_requires_authentication():
    response = client.get("/api/history")

    assert response.status_code == 401

def test_history_by_id_requires_authentication():
    response = client.get("/api/history/2")

    assert response.status_code == 401