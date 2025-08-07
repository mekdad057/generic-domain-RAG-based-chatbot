from .processing_pipeline import response_pipeline

def generate_response(conversation, query):
    print("!!generating response!!")
    
    # setup conversation history
    user_messages = [message.content for message in conversation.messages.filter(role = 'user')]
    print("user messages:" , user_messages)  

    # generate response
    response = response_pipeline.generate_response(user_messages)
    return response