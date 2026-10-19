from collections import defaultdict
from datetime import datetime
from typing import List, Dict


def predict_next_month(expenses: List[Dict]) -> float:
    monthly_totals: Dict[str, float] = defaultdict(float)
    for expense in expenses:
        date = expense.get("date")
        if not date:
            continue
        month = date[:7]
        monthly_totals[month] += float(expense.get("amount", 0))

    if not monthly_totals:
        return 0.0

    sorted_months = sorted(monthly_totals)
    if len(sorted_months) < 2:
        return round(monthly_totals[sorted_months[-1]], 2)

    first = monthly_totals[sorted_months[0]]
    last = monthly_totals[sorted_months[-1]]
    trend = (last - first) / (len(sorted_months) - 1)
    prediction = last + trend
    return round(prediction, 2)
