from pathlib import Path

import pandas as pd
from sentence_transformers import SentenceTransformer

from app.utils.similarity import find_best_match


class NLPService:
    """Loads the complaint dataset once and serves embedding similarity matches."""

    def __init__(self) -> None:
        data_path = Path(__file__).resolve().parents[1] / "data" / "hospital_complaints_1500.csv"
        self.dataset = pd.read_csv(data_path)
        self.model = SentenceTransformer("all-MiniLM-L6-v2", local_files_only=True)
        complaint_texts = self.dataset["complaint_text"].fillna("").tolist()
        # Precompute dataset embeddings once so request-time matching stays fast.
        self.dataset_embeddings = self.model.encode(
            complaint_texts,
            convert_to_numpy=True,
            normalize_embeddings=True,
        )

    def get_best_match(self, complaint_text: str) -> dict[str, str]:
        user_embedding = self.model.encode(
            [complaint_text],
            convert_to_numpy=True,
            normalize_embeddings=True,
        )
        best_index = find_best_match(user_embedding, self.dataset_embeddings)
        match = self.dataset.iloc[best_index]
        return {
            "category": str(match["category"]),
            "department": str(match["department"]),
            "automatic_reply": str(match["auto_reply"]),
        }


nlp_service = NLPService()
