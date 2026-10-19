from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict, Optional


@dataclass
class Expense:
    user_email: str
    merchant: str
    category: str
    amount: float
    payment_method: Optional[str]
    date: str
    description: Optional[str] = None
    created_at: Optional[str] = None
    id: Optional[int] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Expense":
        return cls(
            user_email=data.get("user_email", "demo@example.com"),
            merchant=data.get("merchant", "Unknown"),
            category=data.get("category", "Miscellaneous"),
            amount=float(data.get("amount", 0)),
            payment_method=data.get("payment_method"),
            date=data.get("date") or datetime.now().strftime("%Y-%m-%d"),
            description=data.get("description"),
            created_at=data.get("created_at") or datetime.now().isoformat(),
            id=data.get("id"),
        )

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user_email": self.user_email,
            "merchant": self.merchant,
            "category": self.category,
            "amount": self.amount,
            "payment_method": self.payment_method,
            "date": self.date,
            "description": self.description,
            "created_at": self.created_at,
        }
