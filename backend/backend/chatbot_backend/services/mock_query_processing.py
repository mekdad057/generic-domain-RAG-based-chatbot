def mock_generate_response(conversation, user_query):
    """
    Simplified mock function to simulate AI response generation.
    Returns only the response text as requested.
    """
    # Simple keyword-based response generation
    if "مرحباً" in user_query.lower():
        return "أهلا ما هو سؤالك؟"
    elif "help" in user_query.lower():
        return "I'm here to help. What would you like to know?"
    elif "thank" in user_query.lower():
        return "You're welcome! Let me know if you need anything else."
    else:
        return f"I understand you're asking about '{user_query[:50]}...'. This is a simulated response from our AI system."