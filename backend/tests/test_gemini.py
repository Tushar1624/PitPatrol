import os

import pytest
from dotenv import load_dotenv
from google import genai


load_dotenv()


def test_gemini_configuration():
    api_key = os.getenv("GEMINI_API_KEY")

    assert api_key is not None
    assert api_key.strip() != ""

    client = genai.Client(api_key=api_key)

    assert client is not None