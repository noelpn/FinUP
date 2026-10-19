import sqlite3
from collections import Counter, defaultdict
from datetime import datetime
from typing import Dict, List, Any

from database import get_db_connection
from models import Expense
from predictor import predict_next_month
from config import MONTHLY_BUDGET, DEFAULT_CATEGORY_LIMITS


def add_expense(user_email: str, expense_data: Dict[str, Any]) -> Dict[str, Any]:
    expense = Expense.from_dict({**expense_data, "user_email": user_email})
    conn = get_db_connection()
    try:
        cursor = conn.execute(
            """
            INSERT INTO expenses (user_email, merchant, category, amount, payment_method, date, description, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                expense.user_email,
                expense.merchant,
                expense.category,
                expense.amount,
                expense.payment_method,
                expense.date,
                expense.description,
                expense.created_at,
            ),
        )
        conn.commit()
        expense.id = cursor.lastrowid
        return {"success": True, "expense": expense.to_dict()}
    finally:
        conn.close()


def get_expenses(user_email: str) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        rows = conn.execute(
            "SELECT * FROM expenses WHERE user_email = ? ORDER BY date DESC, id DESC",
            (user_email,),
        ).fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def get_expense_by_id(user_email: str, expense_id: int) -> Dict[str, Any] | None:
    conn = get_db_connection()
    try:
        row = conn.execute(
            "SELECT * FROM expenses WHERE user_email = ? AND id = ?",
            (user_email, expense_id),
        ).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def update_expense(user_email: str, expense_id: int, expense_data: Dict[str, Any]) -> bool:
    expense = Expense.from_dict({**expense_data, "user_email": user_email})
    conn = get_db_connection()
    try:
        cursor = conn.execute(
            """
            UPDATE expenses
            SET merchant = ?, category = ?, amount = ?, payment_method = ?, date = ?, description = ?
            WHERE user_email = ? AND id = ?
            """,
            (
                expense.merchant,
                expense.category,
                expense.amount,
                expense.payment_method,
                expense.date,
                expense.description,
                user_email,
                expense_id,
            ),
        )
        conn.commit()
        return cursor.rowcount > 0
    finally:
        conn.close()


def delete_expense(user_email: str, expense_id: int) -> bool:
    conn = get_db_connection()
    try:
        cursor = conn.execute(
            "DELETE FROM expenses WHERE user_email = ? AND id = ?",
            (user_email, expense_id),
        )
        conn.commit()
        return cursor.rowcount > 0
    finally:
        conn.close()


def get_dashboard_data(user_email: str) -> Dict[str, Any]:
    expenses = get_expenses(user_email)
    now = datetime.now()
    current_month = now.strftime("%Y-%m")
    previous_month = (now.replace(day=1) if False else None)

    current_month_total = sum(float(item["amount"]) for item in expenses if item["date"].startswith(current_month))
    previous_month_total = sum(float(item["amount"]) for item in expenses if item["date"].startswith(_month_offset(current_month, -1)))

    category_totals = defaultdict(float)
    for item in expenses:
        category_totals[item["category"]] += float(item["amount"])

    highest_category, highest_amount = max(category_totals.items(), key=lambda item: item[1], default=("None", 0.0))
    predicted_expense = predict_next_month(expenses)

    monthly_total = current_month_total
    total_categories = len(category_totals)
    total_income = 60000
    total_savings = max(total_income - monthly_total, 0)

    alerts = []
    for category, limit in DEFAULT_CATEGORY_LIMITS.items():
        spent = category_totals.get(category, 0)
        if spent >= limit * 0.8:
            alerts.append(f"{category} is nearing its budget limit")

    suggestions = [
        "Reduce discretionary spending to stay on track.",
        "Review recurring subscriptions this month.",
    ]

    return {
        "total_expense": round(monthly_total, 2),
        "remaining_budget": round(MONTHLY_BUDGET - monthly_total, 2),
        "predicted_expense": round(predicted_expense, 2),
        "highest_category": highest_category,
        "highest_amount": round(highest_amount, 2),
        "monthly_budget": MONTHLY_BUDGET,
        "total_spent": round(monthly_total, 2),
        "usage_percentage": round((monthly_total / MONTHLY_BUDGET) * 100, 1) if MONTHLY_BUDGET else 0,
        "avg_daily": round(monthly_total / 30, 2),
        "predicted_month": round(predicted_expense, 2),
        "previous_month": round(previous_month_total, 2),
        "current_month": round(current_month_total, 2),
        "difference": round(current_month_total - previous_month_total, 2),
        "percentage": round(((current_month_total - previous_month_total) / previous_month_total) * 100, 1) if previous_month_total else 0.0,
        "expected_savings": round(max(total_income - monthly_total, 0), 2),
        "budget_status": "Healthy" if monthly_total < MONTHLY_BUDGET * 0.8 else "At Risk",
        "monthly_total": round(monthly_total, 2),
        "total_categories": total_categories,
        "total_income": total_income,
        "total_savings": round(total_savings, 2),
        "suggestions": suggestions,
        "alerts": alerts or ["No budget alerts this month"],
        "reports": expenses,
        "expenses": expenses,
        "recent_expenses": expenses[:5],
        "comparison_data": _build_comparison_data(expenses),
        "categories": [{"name": name, "amount": round(amount, 2)} for name, amount in sorted(category_totals.items())],
        "category_budget": _build_category_budget(category_totals),
        "savings": _build_savings_suggestions(category_totals),
        "ai_summary": [f"You spent ₹{monthly_total:,.0f} this month"],
        "comparison_insights": [f"Current month spending is {round(((current_month_total - previous_month_total) / previous_month_total) * 100, 1) if previous_month_total else 0.0}% compared to last month"],
        "category_suggestions": ["Try reducing high-spend categories to improve savings"],
        "recommendations": ["Set a weekly spending cap for discretionary purchases"],
    }


def _build_comparison_data(expenses: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    current_month = datetime.now().strftime("%Y-%m")
    previous_month = _month_offset(current_month, -1)
    current = defaultdict(float)
    previous = defaultdict(float)
    for item in expenses:
        month = item["date"][:7]
        if month == current_month:
            current[item["category"]] += float(item["amount"])
        elif month == previous_month:
            previous[item["category"]] += float(item["amount"])

    rows = []
    for category in sorted(set(current) | set(previous)):
        prev = previous.get(category, 0.0)
        cur = current.get(category, 0.0)
        change = ((cur - prev) / prev * 100) if prev else 0.0
        rows.append({
            "category": category,
            "previous": round(prev, 2),
            "current": round(cur, 2),
            "change": f"{change:+.1f}%",
        })
    return rows


def _build_category_budget(category_totals: Dict[str, float]) -> List[Dict[str, Any]]:
    rows = []
    for category, limit in DEFAULT_CATEGORY_LIMITS.items():
        spent = category_totals.get(category, 0.0)
        rows.append({
            "category": category,
            "limit": limit,
            "spent": round(spent, 2),
            "remaining": round(limit - spent, 2),
        })
    return rows


def _build_savings_suggestions(category_totals: Dict[str, float]) -> List[Dict[str, Any]]:
    rows = []
    for category, limit in DEFAULT_CATEGORY_LIMITS.items():
        spent = category_totals.get(category, 0.0)
        if spent > 0:
            rows.append({
                "category": category,
                "current": round(spent, 2),
                "suggested": round(limit * 0.8, 2),
                "saved": round(max(spent - limit * 0.8, 0.0), 2),
            })
    return rows


def _month_offset(month: str, offset: int) -> str:
    year, month_int = map(int, month.split("-"))
    month_int += offset
    while month_int < 1:
        month_int += 12
        year -= 1
    while month_int > 12:
        month_int -= 12
        year += 1
    return f"{year:04d}-{month_int:02d}"
