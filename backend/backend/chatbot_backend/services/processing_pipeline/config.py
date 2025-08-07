import zipfile
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent


PROCESSING_CONFIG = {
    "response_config": {
        "embedding_model": "sayed0am/arabic-english-bge-m3",
        "embedding_api": "https://router.huggingface.co/hf-inference/models/sayed0am/arabic-english-bge-m3/pipeline/feature-extraction",
        "chroma_testing_vdb_path": BASE_DIR / "vectordb-aren-sayed0am-testing.zip",
        "loaded_vdb_path": BASE_DIR / "chatbot_backend/vectordb",
        "chat_model": "microsoft/phi-4",
        "history_max_length": 3

        

    },
    "HF_API_TOKEN": read_secrets("HF_API_TOKEN"),
}

def load_vdb(vdb_zip_path = None):
    vdb_zip_path = vdb_zip_path or PROCESSING_CONFIG["response_config"]["chroma_testing_vdb_path"]
    vdb_path = PROCESSING_CONFIG["response_config"]["loaded_vdb_path"]
    # Create directory if it doesn't exist
    os.makedirs(vdb_path, exist_ok=True)
    # Unzip

    with zipfile.ZipFile(vdb_zip_path, 'r') as zip_ref:
        zip_ref.extractall(vdb_path)
    if os.path.exists(vdb_zip_path):
        print(f"VDB exists in ", vdb_zip_path)
    else:
        print("VDB doesn't exist...")
        print("expected at ", vdb_zip_path)
    print(f"Documents extracted to {vdb_path}")   
    return True


load_vdb()