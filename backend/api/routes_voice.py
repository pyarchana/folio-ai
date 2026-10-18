"""
Voice Briefing API Endpoints
Generates audio summary scripts and speech payloads.
"""

from typing import Dict, Any
from fastapi import APIRouter
from ..models.audit import AuditSummary
from ..services.voice_briefing import VoiceBriefingService

router = APIRouter(prefix="/api/voice", tags=["Voice Briefing"])
voice_service = VoiceBriefingService()


@router.post("/briefing")
def get_voice_briefing(payload: Dict[str, Any]):
    """Generates executive 30-second audio summary payload."""
    summary_data = payload.get("summary", {})
    persona_name = payload.get("persona_name", "Freelancer")
    
    summary = AuditSummary(**summary_data)
    return voice_service.generate_briefing_script(summary, persona_name=persona_name)
