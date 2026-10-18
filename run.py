"""
Folio Server Launcher
Executes Uvicorn server hosting the Folio backend and spatial frontend.
"""

import os
import uvicorn
from backend.config import settings

if __name__ == "__main__":
    port = int(os.environ.get("PORT", settings.port))
    host = os.environ.get("HOST", "0.0.0.0" if os.environ.get("PORT") else settings.host)
    is_prod = bool(os.environ.get("PORT"))
    print(f"Starting {settings.app_name} on http://{host}:{port}")
    uvicorn.run(
        "backend.main:app",
        host=host,
        port=port,
        reload=not is_prod,
    )

