BASE_DIR = Path(__file__).resolve().parent.parent

def read_secrets(key):
    contents = None
    with open(BASE_DIR / "secret.config",'r') as s:
        contents = s.read()
    if not contents: 
        raise ValueError("you haven't created the secret.config file!!!")
    secrets = contents.split('\n')
    kv_pairs = [s.split('=') for s in secrets]
    kv_pairs = [[kv[0].strip(), kv[1].strip()] for kv in kv_pairs]
    return [kv for kv in kv_pairs if kv[0] == key][1]
