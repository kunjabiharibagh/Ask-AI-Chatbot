import os
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

app = FastAPI()
# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# gemini_model = genai.GenerativeModel("gemini-2.5-flash")
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
# load embedding model once at startup
model = SentenceTransformer('all-MiniLM-L6-v2')

# load and embed knowledge base once at startup
with open('data/knowledge.txt', 'r') as f:
    text = f.read()
chunks = [p.strip() for p in text.split('\n\n') if p.strip()]
chunk_embeddings = model.encode(chunks)

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def retrieve_context(question, top_k=3):
    question_embedding = model.encode(question)
    similarities = [cosine_similarity(question_embedding, emb) for emb in chunk_embeddings]
    top_indices = np.argsort(similarities)[-top_k:][::-1]
    return [chunks[i] for i in top_indices]

class ChatRequest(BaseModel):
    text: str

@app.post("/predict")
def predict(request: ChatRequest):
    context_chunks = retrieve_context(request.text)
    context = ". ".join(context_chunks)

    prompt = f"""You are a helpful study assistant. Use the context below if relevant to answer the question. If it's not relevant, just answer using your own knowledge directly — don't mention the context or explain your reasoning, just answer the question.

Context: {context}

Question: {request.text}"""

    response = groq_client.chat.completions.create(
    model="llama-3.1-8b-instant",
    messages=[{"role": "user", "content": prompt}]
    )
    return {"reply": response.choices[0].message.content}