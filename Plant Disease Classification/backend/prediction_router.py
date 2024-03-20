from fastapi import APIRouter, Form
from schemas import Message
import edge_predictor
import cloud_predictor
import torchvision.transforms as transforms
from PIL import Image
from remedies import remedies
import base64
from io import BytesIO
from pydantic import Json


router = APIRouter(
    prefix="/predict",
    tags=['predict_image']
)


@router.post('/edge', status_code=200)
def predict_from_edge(data: Json = Form()):
    try:
        pass
        img = data['image'][23:]
        img = Image.open(BytesIO(base64.decodebytes(bytes(img, "utf-8"))))
        edge_img = img.resize((256, 256))
        convert_tensor = transforms.ToTensor()
        edge_img = convert_tensor(edge_img)
        prediction = edge_predictor.predict_image(edge_img, edge_predictor.model)
        remedies[prediction[0]]['accuracy']=prediction[1]

        if int(prediction[1] * 100) < 95:
            mem_img = BytesIO()
            img.save(mem_img, format = 'jpeg')
            encoded_image = base64.b64encode(mem_img.getvalue()).decode('utf-8')
            mem_img.close()
            remedies[prediction[0]]['cloud']=cloud_predictor.predict_image_edge(encoded_image)
        
        return remedies[prediction[0]]

    except Exception as e:
        print(e)
        return Message(f"Error Occured")
    
@router.post('/cloud', status_code=200)
def predict_from_server(data: Json = Form()):
    try:
        img = data['image'][23:]
        img = Image.open(BytesIO(base64.decodebytes(bytes(img, "utf-8"))))

        mem_img = BytesIO()
        img.save(mem_img, format = 'jpeg')
        encoded_image = base64.b64encode(mem_img.getvalue()).decode('utf-8')
        mem_img.close()

        return cloud_predictor.predict_image_detailed(
            encoded_image,
            data['plantName'],
            data['region'],
            data['temperature'],
            data['soilPH'],
            data['soilType'],
            data['imageDescription']
        )

    except Exception as e:
        print(e)
        return Message(f"Error Occured")
