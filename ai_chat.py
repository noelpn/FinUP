import os
from typing import List, Dict, Any

# Hardcoded OpenAI API Key
OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"  # Replace with actual key

def _get_chat_client():
    """Lazily import and initialize LangChain ChatOpenAI."""
    try:
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            api_key=OPENAI_API_KEY,
            model="gpt-3.5-turbo",
            temperature=0.7,
            max_tokens=500,
        )
    except ImportError as e:
        raise RuntimeError(f"LangChain/OpenAI import failed: {e}. Make sure langchain and langchain-openai are installed.")

SYSTEM_PROMPT = """You are Thomas Cook AI, a finance-focused financial advisor assistant.
Your name is Thomas Cook AI and you specialize in personal finance, budgeting, expense management, 
and financial advice for individuals.

Key responsibilities:
- Help users understand their spending patterns
- Provide budgeting advice and recommendations
- Suggest ways to reduce unnecessary expenses
- Help with financial planning and savings strategies
- Provide insights on expense categories
- Answer questions about personal finance management

Be friendly, professional, and always provide actionable financial advice.
Keep responses concise and focused on personal finance."""


def generate_finance_response(user_message: str, conversation_history: List[Dict[str, str]] = None) -> str:
    """
    Generate a finance-related response using Thomas Cook AI.
    
    Args:
        user_message: The user's message/question
        conversation_history: Optional list of previous messages for context
    
    Returns:
        AI-generated response
    """
    if conversation_history is None:
        conversation_history = []
    
    try:
        chat = _get_chat_client()
        from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
        
        # Build message list with system prompt
        messages = [SystemMessage(content=SYSTEM_PROMPT)]
        
        # Add conversation history
        for msg in conversation_history:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                messages.append(AIMessage(content=msg["content"]))
        
        # Add current user message
        messages.append(HumanMessage(content=user_message))
        
        # Get response from OpenAI
        response = chat.invoke(messages)
        return response.content
    
    except Exception as exc:
        return f"Unable to process your request: {str(exc)}"


def get_financial_suggestions(expenses: List[Dict[str, Any]], budget: float) -> str:
    """
    Get AI-powered financial suggestions based on expenses.
    
    Args:
        expenses: List of expense dictionaries
        budget: Monthly budget
    
    Returns:
        AI-generated suggestions
    """
    try:
        total_spent = sum(float(e.get("amount", 0)) for e in expenses)
        categories = {}
        for expense in expenses:
            cat = expense.get("category", "Other")
            categories[cat] = categories.get(cat, 0) + float(expense.get("amount", 0))
        
        category_breakdown = "\n".join([f"- {cat}: ₹{amount:.2f}" for cat, amount in categories.items()])
        
        prompt = f"""Analyze the following spending data and provide personalized financial advice:

Total Budget: ₹{budget:.2f}
Total Spent: ₹{total_spent:.2f}
Remaining: ₹{budget - total_spent:.2f}

Spending by Category:
{category_breakdown}

Provide specific, actionable recommendations to improve financial health."""
        
        return generate_finance_response(prompt)
    except Exception as exc:
        return f"Error generating suggestions: {str(exc)}"
