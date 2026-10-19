from functools import lru_cache

from werkzeug.utils import secure_filename

from config import UPLOAD_DIR


@lru_cache(maxsize=1)
def get_whisper_pipeline():
    try:
        import torch
        from transformers import pipeline
    except ImportError as exc:
        raise RuntimeError("transformers and torch are required. Install them first.") from exc

    device = 0 if torch.cuda.is_available() else -1
    return pipeline(
        "automatic-speech-recognition",
        model="openai/whisper-base",
        chunk_length_s=30,
        device=device,
    )


def transcribe_audio(audio_file) -> str:
    filename = secure_filename(audio_file.filename or "expense.wav")
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    saved_path = UPLOAD_DIR / filename
    audio_file.save(saved_path)

    try:
        pipeline = get_whisper_pipeline()
        result = pipeline(
            str(saved_path),
            generate_kwargs={"task": "transcribe", "language": "en"},
        )
        transcription = result["text"].strip() if isinstance(result, dict) and "text" in result else str(result).strip()
        if not transcription:
            raise RuntimeError("Whisper returned an empty transcription.")
        return transcription
    except Exception as exc:
        raise RuntimeError(f"Whisper transcription failed: {exc}") from exc
