import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';

export default function ImageWork() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState(0);
  const selectImages = () => {
    const options = {
      mediaType: 'any',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      multiple: true,
      selectionLimit: 0,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let temp = [];
        response?.assets?.map(item => {
          temp?.push(item);
        });
        if (images?.length > 0) {
          setImages([...images, ...temp]);
        } else {
          setImages(temp);
        }
      }
    });
  };

  const uploadImages = async () => {
    if (images.length === 0) {
      return;
    }

    setUploading(true);
    let countss = 0;

    const uploadPromises = images.map(async (image, index) => {
      const formData = new FormData();
      formData.append('images', {
        uri: Platform.OS == 'ios' ? image.sourceURL : image.path,
        type: image.mime,
        name: 'testimage',
      });
      try {
        // Update upload status for the current image
        setImages(prevImages =>
          prevImages.map((prevImage, i) =>
            i === index
              ? {...prevImage, uploading: true, statusUploaded: false}
              : prevImage,
          ),
        );
        const response = await axios.post(
          'https://shafiapidevrvp.demoz.agency/api/v1/upload',
          formData,

          {
            headers: {
              'Content-Type': 'multipar/form-data',
            },
            onUploadProgress: progressEvent => {
              const uploadProgress =
                (progressEvent.loaded / progressEvent.total) * 100;
              setProgress(
                prevProgress =>
                  prevProgress + (1 / images.length) * uploadProgress,
              );
            },
          },
        ); 

        // Update upload status for the current image
        setImages(prevImages =>
          prevImages.map((prevImage, i) =>
            i === index
              ? {...prevImage, uploading: false, statusUploaded: true}
              : prevImage,
          ),
        );
      } catch (error) {
        setUploading(false);
        setProgress(0);
        console.error('Error uploading image:', error);
        // Handle error
      }
    });

    try {
      await Promise.all(uploadPromises);
      setUploading(false);
      setProgress(0);
      // Handle success
    } catch (error) {
      setUploading(false);
      setProgress(0);
      console.error('Error uploading images:', error);
      // Handle error
    }
  };
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {images.map((image, index) => (
        <View key={index} style={{marginBottom: 20}}>
          <Image source={{uri: image.uri}} style={{width: 40, height: 40}} />
          {image.uploading && (
            <ActivityIndicator
              color={'red'}
              style={{marginTop: 10, position: 'absolute', top: 0, left: 10}}
            />
          )}
          {image.statusUploaded && (
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/7799/7799536.png',
              }}
              style={{
                width: 20,
                height: 20,
                position: 'absolute',
                top: 10,
                left: 10,
              }}
            />
          )}
        </View>
      ))}
      <TouchableOpacity
        onPress={selectImages}
        style={{padding: 10, backgroundColor: '#ccc', marginBottom: 20}}>
        <Text  
                  allowFontScaling={false}
        
        >Select Images</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={uploadImages}
        disabled={images.length === 0 || uploading}
        style={{padding: 10, backgroundColor: '#007bff', borderRadius: 5}}>
        <Text 
                  allowFontScaling={false}
        
        style={{color: 'white'}}>Upload Images</Text>
      </TouchableOpacity>
    </View>
  );
}
