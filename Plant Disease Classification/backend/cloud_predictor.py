import requests
import os
from dotenv import load_dotenv

load_dotenv()

def predict_image(image):
    api_key = os.getenv('OPEN_AI_API_KEY')

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    payload = {
        "model": "gpt-4-vision-preview",
        "messages": [
            {
            "role": "user",
            "content": [
                {
                "type": "text",
                "text": "What plant can you identify in this image and also What plant disease possibly can you identify in this image?"
                },
                {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{image}"
                }
                }
            ]
            }
        ],
        "max_tokens": 100
    }

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

    return response.json()