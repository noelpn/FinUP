import re
from datetime import datetime, timedelta
from typing import Dict, Any


def parse_expense_text(text: str) -> Dict[str, Any]:
    cleaned = (text or "").strip()
    if not cleaned:
        raise ValueError("Expense text is required")

    amount = _extract_amount(cleaned)
    if amount is None:
        raise ValueError("Could not find an amount in the provided text")

    merchant = _extract_merchant(cleaned)
    category = _guess_category(cleaned)
    payment_method = "Card" if re.search(r"card|upi|wallet|bank", cleaned.lower()) else "Cash"
    date = _extract_date(cleaned)

    return {
        "merchant": merchant,
        "category": category,
        "amount": round(amount, 2),
        "payment_method": payment_method,
        "date": date,
        "description": cleaned,
    }


def _extract_amount(text: str):
    match = re.search(r"(?:rs|₹)?\s*(\d+(?:\.\d{1,2})?)", text.lower().replace("inr", ""))
    if not match:
        return None
    return float(match.group(1))


def _extract_merchant(text: str) -> str:
    patterns = [
        r"at\s+([A-Za-z0-9 .,&-]+)",
        r"from\s+([A-Za-z0-9 .,&-]+)",
        r"for\s+([A-Za-z0-9 .,&-]+)",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            merchant = match.group(1).strip()
            return merchant.title()
    return "Unknown Merchant"


def _guess_category(text: str) -> str:
    lowered = text.lower()
    if any(word in lowered for word in ["grocery", "food", "restaurant", "lunch", "dinner", "coffee", "tea", "milk"]):
        return "Food"
    if any(word in lowered for word in ["amazon", "shop", "shopping", "clothes", "electronics", "flipkart", "store"]):
        return "Shopping"
    if any(word in lowered for word in ["uber", "taxi", "train", "flight", "bus", "fuel", "travel"]):
        return "Travel"
    if any(word in lowered for word in ["electric", "bill", "internet", "water", "rent", "utility"]):
        return "Utilities"
    if any(word in lowered for word in ["movie", "netflix", "game", "entertainment", "stream"]):
        return "Entertainment"
    if any(word in lowered for word in ["doctor", "medicine", "pharmacy", "health"]):
        return "Health"
    return "Miscellaneous"


def _extract_date(text: str) -> str:
    lowered = text.lower()
    if "today" in lowered:
        return datetime.now().strftime("%Y-%m-%d")
    if "yesterday" in lowered:
        return (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

    for pattern in [r"(\d{4}-\d{2}-\d{2})", r"(\d{2}/\d{2}/\d{4})", r"(\d{2}-\d{2}-\d{4})"]:
        match = re.search(pattern, text)
        if match:
            raw = match.group(1)
            try:
                return datetime.strptime(raw, "%Y-%m-%d").strftime("%Y-%m-%d")
            except ValueError:
                try:
                    return datetime.strptime(raw, "%d/%m/%Y").strftime("%Y-%m-%d")
                except ValueError:
                    return datetime.strptime(raw, "%d-%m-%Y").strftime("%Y-%m-%d")
    return datetime.now().strftime("%Y-%m-%d")
