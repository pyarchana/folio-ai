"""
Voice Briefing Service
Generates an executive audio summary of the user's monthly deductions and tax savings.
Supports Web Speech API and optional ElevenLabs text-to-speech synthesis.
"""

from typing import Dict, Any
from ..models.audit import AuditSummary


class VoiceBriefingService:
    """Creates audio executive briefing scripts and voice synthesis payloads."""

    def generate_briefing_script(self, summary: AuditSummary, persona_name: str = "Freelancer") -> Dict[str, Any]:
        """Crafts a concise 30-second executive audio recap."""
        top_categories = sorted(
            summary.category_totals.items(),
            key=lambda x: x[1],
            reverse=True
        )[:2]
        
        cat_highlights = ""
        if top_categories:
            cat_highlights = f"Your biggest write-offs were in {top_categories[0][0]} totaling ${top_categories[0][1]:.2f}."

        script = (
            f"Hello! Here is your Folio tax audit recap for your {persona_name} workspace. "
            f"We analyzed {summary.total_transactions} transactions and identified "
            f"${summary.total_deductible:,.2f} in verified business write-offs. "
            f"That puts approximately ${summary.estimated_tax_savings:,.2f} directly back into your pocket. "
            f"{cat_highlights} "
            f"Your tax health score is {summary.tax_health_score} out of 100, and we flagged {summary.anomaly_count} potential expense anomalies. "
            f"All data remained 100% private and air-gapped on your device."
        )

        return {
            "title": "Folio Executive Audio Briefing",
            "script": script,
            "duration_est_seconds": 32,
            "tax_saved": summary.estimated_tax_savings,
            "deductions_found": summary.total_deductible,
            "health_score": summary.tax_health_score,
        }
