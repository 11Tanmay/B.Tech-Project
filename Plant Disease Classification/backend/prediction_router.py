from fastapi import APIRouter, File, UploadFile
from schemas import Message
import edge_predictor
import cloud_predictor
import torchvision.transforms as transforms
from PIL import Image
from typing import Annotated
from remedies import remedies
import base64
from io import BytesIO


router = APIRouter(
    prefix="/predict",
    tags=['predict_image']
)


@router.post('/edge', status_code=200)
def predict_from_edge(file: Annotated[UploadFile, File()]):
    try:
        img = Image.open(file.file)
        img = img.resize((256, 256))
        convert_tensor = transforms.ToTensor()
        img = convert_tensor(img)
        prediction = edge_predictor.predict_image(img, edge_predictor.model)
        remedies[prediction[0]]['accuracy']=prediction[1]
        return remedies[prediction[0]]

    except Exception as e:
        print(e)
        return Message(f"Error Occured")
    
@router.post('/cloud', status_code=200)
def predict_from_server(file: Annotated[UploadFile, File()]):
    try:
        img = Image.open(file.file)

        mem_img = BytesIO()
        img.save(mem_img, format = 'jpeg')
        encoded_image = base64.b64encode(mem_img.getvalue()).decode('utf-8')
        mem_img.close()

        return cloud_predictor.predict_image(encoded_image)

    except Exception as e:
        print(e)
        return Message(f"Error Occured")
