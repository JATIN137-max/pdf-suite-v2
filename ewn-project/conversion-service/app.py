# app.py
# Standalone conversion service: Word->PDF via LibreOffice headless,
# PDF->Word via pdf2docx. Kept separate from the main Node backend so
# LibreOffice's ~600MB footprint never touches that service's image or
# memory budget. Called by pdfController.js on the main backend - never
# exposed directly to the browser.

import os
import subprocess
import uuid
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pdf2docx import Converter

app = FastAPI()

# Lock CORS down to your main backend's Render URL via env var in production.
# Defaults to "*" only so local testing doesn't require extra setup.
ALLOWED_ORIGIN = os.environ.get("ALLOWED_ORIGIN", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOWED_ORIGIN] if ALLOWED_ORIGIN != "*" else ["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

TMP_DIR = Path("tmp")
TMP_DIR.mkdir(exist_ok=True)

# Free-tier RAM is 512MB total for this service - reject anything that
# risks an OOM mid-conversion. Keep in sync with the multer limit in
# pdfController.js on the main backend.
MAX_FILE_SIZE = 15 * 1024 * 1024  # 15MB


def cleanup(*paths):
    for p in paths:
        try:
            if p and Path(p).exists():
                os.remove(p)
        except OSError:
            pass


@app.get("/health")
def health():
    # Useful both for Render's health checks and for an external uptime
    # pinger if you later decide to keep this service warm.
    return {"status": "ok"}


@app.post("/convert/word-to-pdf")
async def word_to_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(413, "File too large (max 15MB).")

    uid = str(uuid.uuid4())
    input_path = TMP_DIR / f"{uid}.docx"
    output_path = TMP_DIR / f"{uid}.pdf"

    with open(input_path, "wb") as f:
        f.write(contents)

    try:
        result = subprocess.run(
            [
                "soffice", "--headless", "--convert-to", "pdf",
                "--outdir", str(TMP_DIR), str(input_path),
            ],
            capture_output=True,
            timeout=90,
        )
        if result.returncode != 0 or not output_path.exists():
            raise HTTPException(
                500, "Conversion failed. The document may be corrupted or use an unsupported format."
            )

        background_tasks.add_task(cleanup, input_path, output_path)
        return FileResponse(
            output_path,
            media_type="application/pdf",
            filename="converted.pdf",
            background=background_tasks,
        )
    except subprocess.TimeoutExpired:
        cleanup(input_path, output_path)
        raise HTTPException(504, "Conversion timed out. Try a smaller or simpler document.")


@app.post("/convert/pdf-to-word")
async def pdf_to_word(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(413, "File too large (max 15MB).")

    uid = str(uuid.uuid4())
    input_path = TMP_DIR / f"{uid}.pdf"
    output_path = TMP_DIR / f"{uid}.docx"

    with open(input_path, "wb") as f:
        f.write(contents)

    try:
        cv = Converter(str(input_path))
        cv.convert(str(output_path))
        cv.close()

        if not output_path.exists():
            raise HTTPException(
                500, "Conversion failed. The PDF may be scanned, encrypted, or corrupted."
            )

        background_tasks.add_task(cleanup, input_path, output_path)
        return FileResponse(
            output_path,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename="converted.docx",
            background=background_tasks,
        )
    except HTTPException:
        raise
    except Exception as e:
        cleanup(input_path, output_path)
        raise HTTPException(500, f"Conversion failed: {str(e)}")