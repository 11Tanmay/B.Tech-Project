import requests
from environment import OPEN_AI_API_KEY

def predict_image_edge(image):
    api_key = OPEN_AI_API_KEY

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


def predict_image_detailed(image, plantName, region, temperature, soilPH, soilType, imageDescription):
    api_key = OPEN_AI_API_KEY

    prompt = f"""
                This is an image for the plant of {plantName} which grows in {region}.
                The average temperature range for the growth of this plant is {temperature},
                and the pH for the growth is {soilPH}, it grows in {soilType} soil.
                {imageDescription}.
                Based on these prompts and the image what plant disease can you identify in the
                given picture? Describe.
            """

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
                "text": prompt
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
