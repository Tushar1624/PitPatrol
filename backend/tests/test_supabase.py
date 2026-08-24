from app.core.supabase import supabase


def test_supabase_client_exists():
    assert supabase is not None