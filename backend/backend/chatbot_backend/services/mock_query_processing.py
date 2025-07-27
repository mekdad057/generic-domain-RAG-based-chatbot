import random
from ..models import DataSource

MOCK_RESPONSES = [
    "Based on the documents I found, {answer}",
    "According to {source}, {answer}",
    "I discovered that {answer} in the provided materials",
    "The documentation indicates that {answer}",
    "After reviewing the sources, I concluded that {answer}"
]

MOCK_ANSWERS = [
    "this is a key finding in your research",
    "this aligns with our previous discussions",
    "this represents a significant opportunity",
    "this requires further investigation",
    "this is consistent across multiple sources"
]

def mock_generate_response(conversation, user_message):
    """Generate a mock response with simulated citations"""
    # Get active completed data sources
    sources = conversation.data_sources.filter(
        is_active=True, 
        processing_status='completed'
    )
    source_titles = [s.title for s in sources]
    
    # Build mock response
    answer = random.choice(MOCK_ANSWERS)
    response_template = random.choice(MOCK_RESPONSES)
    
    if source_titles:
        source = random.choice(source_titles)
        response = response_template.format(answer=answer, source=source)
        citations = [source]
    else:
        response = f"I couldn't find relevant sources, but {answer}"
        citations = []
    
    return {
        "response": response,
        "citations": citations,
        "confidence": round(random.uniform(0.7, 0.95), 2)
    }