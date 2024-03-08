import './App.css';
import React, {useState} from 'react';
import { InboxOutlined } from '@ant-design/icons'
import Typography from '@mui/material/Typography';
import { Button, message, Upload, Image, ConfigProvider, Descriptions } from 'antd';
import axios from "axios";


const { Dragger } = Upload

function App() {

  const getBase64 = async (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  })

  const [edgeFileList, setEdgeFileList] = useState([]);
  const [edgeUploading, setEdgeUploading] = useState(false);
  const [isEdgeDraggerVis, setIsEdgeDraggerVis] = useState(1);
  const [isEdgeUploadButtonVis, setIsEdgeUploadButtonVis] = useState(1);
  const [isEdgeImageVis, setIsEdgeImageVis] = useState(0);
  const [edgeImageURL, setEdgeImageURL] = useState('');
  const [edgeDescriptionItems, setEdgeDescriptionItems] = useState([]);
  const [isEdgeDescriptionVis, setIsEdgeDescriptionVis] = useState(0);
  const [edgeDescriptiontTitle, setEdgeDescriptionTitle] = useState('');

  const onEdgeChange = async (file) => {
    setEdgeFileList(file.fileList);

    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.fileList[0].originFileObj);
    }

    setEdgeImageURL(file.url || file.preview);
    setIsEdgeImageVis(1);
    setIsEdgeDraggerVis(0);
  }

  const beforeEdgeUpload = async () => {
    return false;
  }

  const handleEdgeUpload = async () => {
    const formData = new FormData();
    formData.append('file', edgeFileList[0].originFileObj);

    setEdgeUploading(true);

    await axios
      .post("http://127.0.0.1:8000/predict/edge", formData)
      .then((res) => {
        console.log(res)
        setEdgeFileList([]);
        setEdgeDescriptionTitle(res.data.title)
        setEdgeDescriptionItems(
          [
            {
              key: '1',
              label: 'Accuracy',
              children: (Math.floor(res.data.accuracy * 10000 ) / 100) + '%',
              span: 1,
            },
            {
              key: '2',
              label: 'Is Disease Contagious',
              children: res.data.contagious,
              span: 2,
            },
            {
              key: '3',
              label: 'Reasons of Infection',
              children: (
                <div>
                  <Typography variant = "body1" align = 'justify'>
                    {res.data.reason}
                  </Typography>
                </div>
              ),
              span: 4
            },
            {
              key: '4',
              label: 'Possible Remedies',
              children: (
                <div>
                  {
                    <ul>
                    {
                      res.data.remedies.map((remedy, index) => {
                        return (
                          <>
                            <li key={index+5}>
                              {remedy}
                            </li>
                          </>
                        )
                      })
                    }
                    </ul>
                  }
                </div>
              ),
            },
          ]
        )
        message.success('edge upload successful.')
        setIsEdgeDescriptionVis(1);
        setIsEdgeUploadButtonVis(0);
      })
      .catch((error) => {
        message.error('edge upload failed.');
        setIsEdgeUploadButtonVis(1);
      })
      .finally(() => {
        setEdgeUploading(false);
        setIsEdgeUploadButtonVis(0);
      });
  }

  const handleEdgeReset = () => {
    setIsEdgeDraggerVis(1);
    setIsEdgeUploadButtonVis(1);
    setIsEdgeImageVis(0);
    setIsEdgeDescriptionVis(0);
  }

  const [cloudFileList, setCloudFileList] = useState([]);
  const [cloudUploading, setCloudUploading] = useState(false);
  const [isCloudDraggerVis, setIsCloudDraggerVis] = useState(1);
  const [isCloudUploadButtonVis, setIsCloudUploadButtonVis] = useState(1);
  const [isCloudImageVis, setIsCloudImageVis] = useState(0);
  const [cloudImageURL, setCloudImageURL] = useState('');
  const [cloudDescriptionItems, setCloudDescriptionItems] = useState([]);
  const [isCloudDescriptionVis, setIsCloudDescriptionVis] = useState(0);
  const [cloudDescriptionTitle, setCloudDescriptionTitle] = useState('');

  const onCloudChange = async (file) => {
    setCloudFileList(file.fileList);

    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.fileList[0].originFileObj);
    }

    setCloudImageURL(file.url || file.preview);
    setIsCloudImageVis(1);
    setIsCloudDraggerVis(0);
  }

  const beforeCloudUpload = async () => {
    return false;
  }

  const handleCloudUpload = async () => {
    const formData = new FormData();
    formData.append('file', cloudFileList[0].originFileObj);

    setCloudUploading(true);

    await axios
      .post("http://127.0.0.1:8000/predict/cloud", formData)
      .then((res) => {
        console.log(res)
        setCloudFileList([]);
        setCloudDescriptionTitle('')
        setCloudDescriptionItems(
          [
            {
              key: '1',
              label: 'Result',
              children: (
                <div>
                  <Typography variant = "body2" align = "justify">
                    {res.data.choices[0].message.content}
                  </Typography> 
                </div>
              )
            },
          ]
        )
        message.success('edge upload successful.')
        setIsCloudDescriptionVis(1);
        setIsCloudUploadButtonVis(0);
      })
      .catch((error) => {
        message.error('edge upload failed.');
        setIsCloudUploadButtonVis(1);
      })
      .finally(() => {
        setCloudUploading(false);
        setIsCloudUploadButtonVis(0);
      });
  }

  const handleCloudReset = () => {
    setIsCloudDraggerVis(1);
    setIsCloudUploadButtonVis(1);
    setIsCloudImageVis(0);
  }

  return (
    <div>
      <div>
        <Typography align='center' color='white' variant='h3'>
          Plant Disease Classifier
        </Typography>
      </div>
      <div>
        <div>
          <div className="uploader">
            <div>
              {
                isEdgeDraggerVis === 1 &&
                <Dragger
                  name='file'
                  multiple={false}
                  showUploadList={false}
                  beforeUpload={beforeEdgeUpload}
                  onChange={onEdgeChange}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="upload-text">
                    Click or drag file to this area.
                  </p>
                  <p className="upload-hint">
                    Upload a single image.
                  </p>
                </Dragger>
              }
            </div>
            <div className="image-area">
              {
                isEdgeImageVis === 1 &&
                <Image 
                  width={300}
                  height={300}
                  src={edgeImageURL}
                />
              }
            </div>
            <div className="upload-button-area">
              {
                isEdgeUploadButtonVis === 1 &&
                <Button
                  type="primary"
                  onClick={handleEdgeUpload}
                  loading={edgeUploading}
                  className="upload-button"
                >
                  {edgeUploading ? 'Uploading' : 'Start Upload'}
                </Button>
              }
              <Button
                type="primary"
                onClick={handleEdgeReset}
                className="upload-button"
              >
                Reset
              </Button>
            </div>
            <>
              {
                isEdgeDescriptionVis === 1 &&
                <div className="description">
                  <ConfigProvider
                    theme={{
                      components: {
                        Descriptions: {
                          titleColor: "rgb(255, 255, 255)",
                          labelBg: "rgb(35, 45, 63)"
                        },
                      }
                    }}
                  >
                  <Descriptions 
                    title={edgeDescriptiontTitle} 
                    bordered items={edgeDescriptionItems}
                    labelStyle={{color: 'white'}}
                    contentStyle={{color: 'white'}}
                  />
                  </ConfigProvider>
                </div>
              }
            </>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div className="uploader">
            <div>
              {
                isCloudDraggerVis === 1 &&
                <Dragger
                  name='file'
                  multiple={false}
                  showUploadList={false}
                  beforeUpload={beforeCloudUpload}
                  onChange={onCloudChange}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="upload-text">
                    Click or drag file to this area.
                  </p>
                  <p className="upload-hint">
                    Upload a single image.
                  </p>
                </Dragger>
              }
            </div>
            <div className="image-area">
              {
                isCloudImageVis === 1 &&
                <Image 
                  width={300}
                  height={300}
                  src={cloudImageURL}
                />
              }
            </div>
            <div className="upload-button-area">
              {
                isCloudUploadButtonVis === 1 &&
                <Button
                  type="primary"
                  onClick={handleCloudUpload}
                  loading={cloudUploading}
                  className="upload-button"
                >
                  {edgeUploading ? 'Uploading' : 'Start Upload'}
                </Button>
              }
              <Button
                type="primary"
                onClick={handleCloudReset}
                className="upload-button"
              >
                Reset
              </Button>
            </div>
            <>
              {
                isCloudDescriptionVis === 1 &&
                <div className="description">
                  <ConfigProvider
                    theme={{
                      components: {
                        Descriptions: {
                          titleColor: "rgb(255, 255, 255)",
                          labelBg: "rgb(35, 45, 63)"
                        },
                      }
                    }}
                  >
                  <Descriptions 
                    title={cloudDescriptionTitle} 
                    bordered items={cloudDescriptionItems}
                    labelStyle={{color: 'white'}}
                    contentStyle={{color: 'white'}}
                  />
                  </ConfigProvider>
                </div>
              }
            </>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
