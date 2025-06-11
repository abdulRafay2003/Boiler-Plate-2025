import {deleteImage, uploadImage} from '../endPoints/uploadImage';

export const uploadImageApi = async body => {
  return uploadImage(body).then(response => response?.data?.data);
};

export const deleteImageApi = async params => {
  return deleteImage(params).then(response => response?.data);
};
