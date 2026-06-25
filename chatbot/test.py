from transformers import AutoTokenizer, AutoModelForCausalLM
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss

tokenizer = AutoTokenizer.from_pretrained("TinyLlama/TinyLlama-1.1B-Chat-v1.0")
model = AutoModelForCausalLM.from_pretrained("TinyLlama/TinyLlama-1.1B-Chat-v1.0")
# messages = [
#     {"role": "user", "content": "Who are you?"},
# ]
# inputs = tokenizer.apply_chat_template(
# 	messages,
# 	add_generation_prompt=True,
# 	tokenize=True,
# 	return_dict=True,
# 	return_tensors="pt",
# ).to(model.device)

# outputs = model.generate(**inputs, max_new_tokens=100)
# print(tokenizer.decode(outputs[0][inputs["input_ids"].shape[-1]:]))

embed_model = SentenceTransformer("all-MiniLM-L6-v2")

text = open("aiContent.txt", "r").read()

chunk_size = 200  # characters (you can tune this)
documents = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]


doc_embeddings = embed_model.encode(documents)
dim = doc_embeddings.shape[1]
index = faiss.IndexFlatL2(dim)

index.add(np.array(doc_embeddings))

query = "I want to make a new account"
query_embedding = embed_model.encode([query])
D, I = index.search(query_embedding, k = min(3, len(documents)))


retrieved_docs = [documents[i] for i in I[0]]
context = "\n".join(retrieved_docs)

messages = [
    {"role": "system", "content": "Answer ONLY using the provided context. If the answer is not in the context, say 'I don't know'."},
    {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}
]

inputs = tokenizer.apply_chat_template(
    messages,
    add_generation_prompt=True,
    return_tensors="pt"
)


output = model.generate(**inputs, max_new_tokens=100)

print(tokenizer.decode(output[0], skip_special_tokens=True))
