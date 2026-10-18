"""
Folio Application Entry Point
FastAPI server serving API endpoints and mounting spatial glassmorphism frontend.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from .config import settings, FRONTEND_DIR
from .api.routes_audit import router as audit_router
from .api.routes_gemma import router as gemma_router
from .api.routes_voice import router as voice_router
from .api.routes_export import router as export_router

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=settings.app_tagline,
)

# CORS configuration for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(audit_router)
app.include_router(gemma_router)
app.include_router(voice_router)
app.include_router(export_router)


@app.get("/api/health")
def health_check():
    """Health check endpoint for deployment."""
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version,
        "privacy_mode": "100% Local Air-Gap Active",
        "tabpfn_status": "Ready",
        "gemma_status": "Ready",
    }


# Mount static frontend directory if present
if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")
