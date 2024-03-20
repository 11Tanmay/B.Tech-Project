import './App.css';
import React, {useState} from 'react';
import { InboxOutlined } from '@ant-design/icons'
import Typography from '@mui/material/Typography';
import { Button, message, Upload, Image, ConfigProvider, Descriptions, Switch, Input, Select } from 'antd';
import axios from "axios";


const { Dragger } = Upload
const { TextArea } = Input;


function App() {

  const getBase64 = async (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  })

  const [switchState, setSwitchState] = useState('Edge');

  const onSwitchChange = () => {
    if(switchState === 'Edge')
    {
      setSwitchState('Cloud');
    }
    else
    {
      setSwitchState('Edge');
    }
  }
  
  const [edgeUploading, setEdgeUploading] = useState(false);
  const [isEdgeDraggerVis, setIsEdgeDraggerVis] = useState(1);
  const [isEdgeUploadButtonVis, setIsEdgeUploadButtonVis] = useState(1);
  const [isEdgeImageVis, setIsEdgeImageVis] = useState(0);
  const [edgeImageURL, setEdgeImageURL] = useState('');
  const [edgeDescriptionItems, setEdgeDescriptionItems] = useState([]);
  const [isEdgeDescriptionVis, setIsEdgeDescriptionVis] = useState(0);
  const [edgeDescriptiontTitle, setEdgeDescriptionTitle] = useState('');

  const onEdgeChange = async (file) => {

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

    formData.append(
      "data",
      JSON.stringify({
        'image': edgeImageURL
      })
    )

    setEdgeUploading(true);

    await axios
      .post("http://127.0.0.1:8000/predict/edge", formData)
      .then((res) => {
        console.log(res)
        setEdgeDescriptionTitle(res.data.title)

        var descriptionItems = [
          {
            key: '1',
            label: 'Model Accuracy',
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
            label: 'Remedies',
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
            span: 4
          },
        ]

        if(res.data.cloud !== undefined)
        {
          descriptionItems.push(
            {
              key: '5',
              label: 'Results from the cloud',
              children: (
                  <div>
                    <Typography variant = "body2" align = 'justify'>
                      {res.data.cloud.choices[0].message.content}
                    </Typography>
                  </div>
              ),
              span: 4
            }
          )
        }
        
        setEdgeDescriptionItems(descriptionItems)

        message.success('Edge upload successful.')
        setIsEdgeDescriptionVis(1);
        setIsEdgeUploadButtonVis(0);
      })
      .catch((error) => {
        message.error('Edge upload failed.');
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

  const [cloudUploading, setCloudUploading] = useState(false);
  const [isCloudDraggerVis, setIsCloudDraggerVis] = useState(1);
  const [isCloudUploadButtonVis, setIsCloudUploadButtonVis] = useState(1);
  const [isCloudImageVis, setIsCloudImageVis] = useState(0);
  const [cloudImageURL, setCloudImageURL] = useState('');
  const [cloudDescriptionItems, setCloudDescriptionItems] = useState([]);
  const [isCloudDescriptionVis, setIsCloudDescriptionVis] = useState(0);
  const [cloudDescriptionTitle, setCloudDescriptionTitle] = useState('');

  const [plantName, setPlantName] = useState('');
  const [region, setRegion] = useState('');
  const [temperature, setTemperature] = useState('');
  const [soilPH, setSoilPH] = useState('');
  const [soilType, setSoilType] = useState('');
  const [imageDescription, setImageDescription] = useState('');

  const handlePlantName = (e) => {
    setPlantName(e.target.value)
  }

  const handleRegion = (value) => {
    setRegion(value);
  }

  const handleTemp = (value) => {
    setTemperature(value)
  }

  const handleSoilPH = (value) => {
    setSoilPH(value)
  }

  const handleSoilType = (value) => {
    setSoilType(value)
  }

  const handleImageDescription = (e) => {
    setImageDescription(e.target.value)
  }

  const regionOptions = [
      {
        value: "Andaman and Nicobar Islands",
        label: "Andaman and Nicobar Islands",
      },
      {
        value: "Andhra Pradesh",
        label: "Andhra Pradesh",
      },
      {
        value: "Arunachal Pradesh",
        label: "Arunachal Pradesh",
      },
      {
        value: "Assam",
        label: "Assam",
      },
      {
        value: "Bihar",
        label: "Bihar",
      },
      {
        value: "Chandigarh",
        label: "Chandigarh",
      },
      {
        value: "Chhattisgarh",
        label: "Chhattisgarh",
      },
      {
        value: "Dadra and Nagar Haveli",
        label: "Dadra and Nagar Haveli",
      },
      {
        value: "Daman and Diu",
        label: "Daman and Diu",
      },
      {
        value: "Delhi",
        label: "Delhi",
      },
      {
        value: "Goa",
        label: "Goa",
      },
      {
        value: "Gujarat",
        label: "Gujarat",
      },
      {
        value: "Haryana",
        label: "Haryana",
      },
      {
        value: "Himachal Pradesh",
        label: "Himachal Pradesh",
      },
      {
        value: "Jammu and Kashmir",
        label: "Jammu and Kashmir",
      },
      {
        value: "Jharkhand",
        label: "Jharkhand",
      },
      {
        value: "Karnataka",
        label: "Karnataka",
      },
      {
        value: "Kerala",
        label: "Kerala",
      },
      {
        value: "Ladakh",
        label: "Ladakh",
      },
      {
        value: "Lakshadweep",
        label: "Lakshadweep",
      },
      {
        value: "Madhya Pradesh",
        label: "Madhya Pradesh",
      },
      {
        value: "Maharashtra",
        label: "Maharashtra",
      },
      {
        value: "Manipur",
        label: "Manipur",
      },
      {
        value: "Meghalaya",
        label: "Meghalaya",
      },
      {
        value: "Mizoram",
        label: "Mizoram",
      },
      {
        value: "Nagaland",
        label: "Nagaland",
      },
      {
        value: "Odisha",
        label: "Odisha",
      },
      {
        value: "Puducherry",
        label: "Puducherry",
      },
      {
        value: "Punjab",
        label: "Punjab",
      },
      {
        value: "Rajasthan",
        label: "Rajasthan",
      },
      {
        value: "Sikkim",
        label: "Sikkim",
      },
      {
        value: "Tamil Nadu",
        label: "Tamil Nadu",
      },
      {
        value: "Telangana",
        label: "Telangana",
      },
      {
        value: "Tripura",
        label: "Tripura",
      },
      {
        value: "Uttar Pradesh",
        label: "Uttar Pradesh",
      },
      {
        value: "Uttarakhand",
        label: "Uttarakhand",
      },
      {
        value: "West Bengal",
        label: "West Bengal"
      }
  ]

  const temperatureOptions = [
    {
      value: 'less than 0 degree celcius',
      label: 'less than 0 degree celcius',
    },
    {
      value: '0-10 degree celcius',
      label: '0-10 degree celcius',
    },
    {
      value: '10-20 degree celcius',
      label: '10-20 degree celcius',
    },
    {
      value: '20-30 degree celcius',
      label: '20-30 degree celcius',
    },
    {
      value: 'more than 30 degree celcius',
      label: 'more than 30 degree celcius',
    },
  ]

  const soilPHoptions = [
    {
      value: 'pH less than 5',
      label: 'pH less than 5',
    },
    {
      value: 'pH 5 to 7',
      label: 'pH 5 to 7',
    },
    {
      value: 'pH 7 to 10',
      label: 'pH 7 to 10',
    },
    {
      value: 'pH greater than 10',
      label: 'pH greater than 10',
    },
  ]

  const soilTypeOptions = [
    {
      value: 'Red soil',
      label: 'Red soil',
    },
    {
      value: 'Alluvial soil',
      label: 'Alluvial soil',
    },
    {
      value: 'Black soil',
      label: 'Black soil',
    },
    {
      value: 'Arid soil',
      label: 'Arid soil',
    },
    {
      value: 'Laterite soil',
      label: 'Laterite soil',
    },
    {
      value: 'Saline soil',
      label: 'Saline soil',
    },
    {
      value: 'Swampy soil',
      label: 'Swampy soil',
    },
    {
      value: 'Forest soil',
      label: 'Forest soil',
    },
    {
      value: 'Sub-Mountain soil',
      label: 'Sub-Mountain soil',
    },
    {
      value: 'Snowfield soil',
      label: 'Snowfield soil',
    },
  ]

  const onCloudChange = async (file) => {

    console.log(file.fileList)

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

    if(
      cloudImageURL === '' ||
      plantName === '' ||
      region === '' ||
      temperature === '' ||
      soilPH === '' ||
      soilType === ''
    )
    {
      message.error('all parametres not set')
      return
    }

    formData.append(
      "data",
      JSON.stringify({
        'image': cloudImageURL,
        'plantName': plantName,
        'region': region,
        'temperature': temperature,
        'soilPH': soilPH,
        'soilType': soilType,
        'imageDescription': imageDescription
      })
    )

    setCloudUploading(true);

    await axios
      .post("http://127.0.0.1:8000/predict/cloud", formData)
      .then((res) => {
        console.log(res)
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
        message.success('Cloud upload successful.')
        setIsCloudDescriptionVis(1);
        setIsCloudUploadButtonVis(0);
      })
      .catch((error) => {
        message.error('Cloud upload failed.');
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
    setIsCloudDescriptionVis(0);

    setPlantName('')
    setRegion('')
    setTemperature('')
    setSoilPH('')
    setSoilType('')
    setImageDescription('')
  }

  return (
    <div>
      <div>
        <Typography align='center' color='white' variant='h3'>
          {
            switchState === 'Edge' ? 'Edge Server' : 'Cloud Server'
          }
        </Typography>
        <div className="switch">
          <Switch
            onChange={onSwitchChange}
          />
        </div>
      </div>
      {
        switchState === 'Edge' &&
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
      }
      {
        switchState === 'Cloud' &&
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
              {
                isCloudUploadButtonVis === 1 &&
                <div
                  className = "cloud-input"
                >
                  <Input placeholder="Name of the Plant" 
                    onChange={handlePlantName}
                    style={{
                      width: '95.5%',
                    }}
                  />
                  <div
                    className = "select"
                  >
                    <Select
                      defaultValue="Region"
                      onChange={handleRegion}
                      options={regionOptions}
                      style={{
                        margin: '2px',
                        width: '47.5%',
                      }}
                    />
                    <Select
                      defaultValue="Temperature Range"
                      onChange={handleTemp}
                      options={temperatureOptions}
                      style={{
                        margin: '2px',
                        width: '47.5%',
                      }}
                    />
                  </div>
                  <div
                    className = 'select'
                  >
                    <Select
                      defaultValue="Soil pH"
                      onChange={handleSoilPH}
                      options={soilPHoptions}
                      style={{
                        margin: '2px',
                        width: '47.5%',
                      }}
                    />
                    <Select
                      defaultValue="Soil Type"
                      onChange={handleSoilType}
                      options={soilTypeOptions}
                      style={{
                        margin: '2px',
                        width: '47.5%',
                      }}
                    />
                  </div>
                  <TextArea
                    value={imageDescription}
                    onChange={handleImageDescription}
                    placeholder="Enter description for the Image"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    style={{
                        margin: '2px',
                        width: '95.5%',
                      }}
                  />
                </div>
              }
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
      }
    </div>
  );
}

export default App;
