import httpsService from '@/services/mainServices/httpgj.service';

export const uploadImage = body => {
  return httpsService.post('/file/image', body, {
    headers: {
      'Content-Type': 'multipart/form-data;',
    },
  });
};

export const deleteImage = params => {
  return httpsService.delete(`/file/delete?filename=${params?.filename}`);
};
