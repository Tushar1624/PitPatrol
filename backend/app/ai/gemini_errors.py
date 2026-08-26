class GeminiError(Exception):
    """Base exception for Gemini-related errors."""


class GeminiConfigurationError(GeminiError):
    """Gemini configuration is missing or invalid."""


class GeminiAPIError(GeminiError):
    """Gemini API request failed."""


class GeminiResponseError(GeminiError):
    """Gemini returned an invalid or unusable response."""