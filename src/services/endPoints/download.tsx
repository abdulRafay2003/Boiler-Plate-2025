import httpsService from '@/services/mainServices/http.service';

export const downloadBrouchers = id => {
  return httpsService.get('/system/v1/download?id='+ id, {timeout: 20000});
};
