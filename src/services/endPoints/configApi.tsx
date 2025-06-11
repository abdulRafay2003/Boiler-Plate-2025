import httpsService from '@/services/mainServices/httpgj.service';

export const getConfigApi = () => {
  return httpsService.get('/financial/config');
};
