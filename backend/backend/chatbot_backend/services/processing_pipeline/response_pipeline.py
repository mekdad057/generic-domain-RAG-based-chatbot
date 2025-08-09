from .config import *
from .custom.prompt_templates import main_prompt_template, fallback_prompt_template

from haystack import Pipeline
from haystack.components.builders import ChatPromptBuilder, PromptBuilder
from haystack.dataclasses import ChatMessage
from haystack.utils import Secret
from haystack.components.generators.chat import HuggingFaceAPIChatGenerator, HuggingFaceLocalChatGenerator
from haystack.components.generators import HuggingFaceLocalGenerator
from haystack.components.routers import ConditionalRouter
from haystack_integrations.components.retrievers.chroma import ChromaEmbeddingRetriever
from haystack_integrations.document_stores.chroma import ChromaDocumentStore
from haystack.utils.hf import HFGenerationAPIType
from haystack import component
from haystack.components.embedders import SentenceTransformersTextEmbedder, HuggingFaceAPITextEmbedder

API_TYPE = HFGenerationAPIType.SERVERLESS_INFERENCE_API

# Initialize document store (using Chroma as in your example)
document_store = ChromaDocumentStore(
    persist_path = PROCESSING_CONFIG["response_config"]["loaded_vdb_path"]
)

query_embedder = HuggingFaceAPITextEmbedder(api_type="text_embeddings_inference",
                                            api_params={"url": PROCESSING_CONFIG["response_config"]["embedding_api"]},
                                            token=Secret.from_token(PROCESSING_CONFIG["HF_API_TOKEN"]))

retriever = ChromaEmbeddingRetriever(document_store=document_store, top_k=PROCESSING_CONFIG["response_config"]["retriever"]["top_k"])

template1 = [ChatMessage.from_user(main_prompt_template)]
main_promptbuilder = ChatPromptBuilder(template=template1, required_variables=["history","query"], variables = ['query', 'history', 'documents'])
template2 = [ChatMessage.from_user(fallback_prompt_template)]
fallback_promptbuilder = ChatPromptBuilder(template=template2, required_variables=["query"])

main_llm = HuggingFaceAPIChatGenerator(
      api_type=API_TYPE,
      api_params={"model": PROCESSING_CONFIG["response_config"]["chat_model"]},
      token=Secret.from_token(PROCESSING_CONFIG["HF_API_TOKEN"])
    )


fallback_llm = HuggingFaceAPIChatGenerator(
      api_type=API_TYPE,
      api_params={"model": PROCESSING_CONFIG["response_config"]["chat_model"]},
      token=Secret.from_token(PROCESSING_CONFIG["HF_API_TOKEN"])
    )


from typing import List
@component
class NoOpComponent:
  @component.output_types(query=str,history=List[str])
  def run(self, history: List[str], **kwargs):
    print(history)
    return {'history':history, 'query':history[-1]}

conditional_router = ConditionalRouter([
    {
        "condition": "{{'no_answer' not in replies[0].text }}",
        "output": "{{replies}}",
        "output_name": "replies",
        "output_type": list[ChatMessage],
    },
    {
        "condition": "{{'no_answer' in replies[0].text }}",
        "output": "{{query}}",
        "output_name": "go_to_fallback",
        "output_type": str,
    },
], unsafe = True)

# Setup pipeline
pipeline = Pipeline()
pipeline.add_component('distributer', NoOpComponent())
pipeline.add_component('embedder', query_embedder)
pipeline.add_component('retriever', retriever)
pipeline.add_component('main_promptbuilder', main_promptbuilder)
pipeline.add_component('fallback_promptbuilder', fallback_promptbuilder)
pipeline.add_component('main_llm', main_llm)
pipeline.add_component('fallback_llm', fallback_llm)
pipeline.add_component('conditional_router', conditional_router)

pipeline.connect('distributer.query', 'embedder.text')
pipeline.connect('distributer.query', 'main_promptbuilder.query')
pipeline.connect('distributer.history', 'main_promptbuilder.history')
pipeline.connect('distributer.query', 'conditional_router.query')

pipeline.connect('embedder.embedding', 'retriever.query_embedding')
pipeline.connect('retriever.documents', 'main_promptbuilder.documents')

pipeline.connect('main_promptbuilder.prompt', 'main_llm.messages')

pipeline.connect('main_llm.replies', 'conditional_router.replies')

pipeline.connect('conditional_router.go_to_fallback', 'fallback_promptbuilder.query')
pipeline.connect('fallback_promptbuilder.prompt', 'fallback_llm.messages')

### Utils

def run(messages_history: str, history_length: int):
  # extracts last sent messages
  proper_history = messages_history[-history_length:] if history_length<len(messages_history) else messages_history
  print("the proper history is: ", proper_history)
  results = pipeline.run({
      'distributer': {'history': proper_history},
      }, include_outputs_from={'retriever','main_promptbuilder', 'main_llm'})
  return results

def get_is_fallback(results):
  return results.get('fallback_llm') is not None

def get_context(results):
  retriever_output = results["retriever"]['documents']
  return retriever_output


def get_reply(results):
  response = results.get('conditional_router') or results.get('fallback_llm')
  print('from conditional router:', results.get('conditional_router') is not None)
  print('from fallback llm:', results.get('fallback_llm') is not None)
  reply = response['replies'][0].text.replace('\n', '')
  return reply

def generate_response(messages_history):
    results = run(messages_history, PROCESSING_CONFIG["response_config"]["history_max_length"])
    reply = get_reply(results)
    return reply