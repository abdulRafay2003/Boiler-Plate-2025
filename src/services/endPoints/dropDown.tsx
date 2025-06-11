import httpsService from '@/services/mainServices/httpgj.service';

export const getDropDownData = () => {
  return httpsService.get('/enum');
};
