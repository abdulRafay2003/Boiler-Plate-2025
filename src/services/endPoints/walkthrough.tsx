import httpsService from '@/services/mainServices/http.service';


export const getWalkThrough = () => {
  return httpsService.get('/pages/v1/walkthrough');
};