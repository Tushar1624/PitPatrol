import os

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

email = os.getenv("TEST1_EMAIL")
password = os.getenv("TEST1_PASSWORD")

client = create_client(url, key)

response = client.auth.sign_in_with_password(
    {
        "email": email,
        "password": password,
    }
)

print("ACCESS TOKEN:")
print(response.session.access_token)