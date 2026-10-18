"""
Folio Server Launcher
Executes Uvicorn server hosting the Folio backend and spatial frontend.
"""

import uvicorn
from backend.config import settings

if __name__ == "__main__":
    print(f"Starting {settings.app_name} on http://{settings.host}:{settings.port}")
    uvicorn.run(
        "backend.main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
    )
