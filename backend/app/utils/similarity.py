from sklearn.metrics.pairwise import cosine_similarity


def find_best_match(user_embedding, dataset_embeddings) -> int:
    """Return the row index of the most similar complaint in the dataset."""
    scores = cosine_similarity(user_embedding, dataset_embeddings)
    return int(scores.argmax())
