from sentence_transformers import SentenceTransformer

# load a small, fast pretrained model
model = SentenceTransformer('all-MiniLM-L6-v2')

# read your knowledge file
with open('data/knowledge.txt', 'r') as f:
    text = f.read()

# split into chunks (simple: one chunk per line/sentence)
#chunks = [line.strip() for line in text.split('.') if line.strip()]
chunks = [p.strip() for p in text.split('\n\n') if p.strip()]
# convert each chunk into an embedding
embeddings = model.encode(chunks)

print(f"Number of chunks: {len(chunks)}")
print(f"Embedding shape: {embeddings.shape}")
print(f"First chunk: {chunks[0]}")
print(f"First embedding (first 5 numbers): {embeddings[0][:5]}")


import numpy as np

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# a test question
question = "What frontend technology was used?"
question_embedding = model.encode(question)

# compare question embedding to every chunk embedding
similarities = [cosine_similarity(question_embedding, emb) for emb in embeddings]

# find the most similar chunk
best_index = np.argmax(similarities)
print(f"\nQuestion: {question}")
print(f"Most relevant chunk: {chunks[best_index]}")
print(f"Similarity score: {similarities[best_index]:.4f}")
