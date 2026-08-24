import os

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        "Supabase environment variables are not configured"
    )


supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_KEY,
)


def get_authenticated_client(access_token: str) -> Client:
    client = create_client(
        SUPABASE_URL,
        SUPABASE_KEY,
    )

    client.postgrest.auth(access_token)

    return client