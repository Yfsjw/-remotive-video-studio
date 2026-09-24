import json, sys
import torch
import clip
from PIL import Image

items = json.load(sys.stdin)
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)
model.eval()

with torch.no_grad():
    texts = clip.tokenize([f"a real video frame showing {x['text']}" for x in items]).to(device)
    text_features = model.encode_text(texts).float()
    text_features /= text_features.norm(dim=-1, keepdim=True)
    results = []
    images = []
    valid = []
    for i, item in enumerate(items):
        try:
            images.append(preprocess(Image.open(item["image"]).convert("RGB")))
            valid.append(i)
        except Exception:
            pass
    if images:
        image_batch = torch.stack(images).to(device)
        image_features = model.encode_image(image_batch).float()
        image_features /= image_features.norm(dim=-1, keepdim=True)
        for pos, idx in enumerate(valid):
            score = float((image_features[pos] * text_features[idx]).sum().item())
            results.append({"id": items[idx]["id"], "score": score})
    for i, item in enumerate(items):
        if not any(r["id"] == item["id"] for r in results):
            results.append({"id": item["id"], "score": -1.0})

print(json.dumps(results))
