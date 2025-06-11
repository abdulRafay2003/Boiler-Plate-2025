import httpsService from '@/services/mainServices/httpgj.service';

export const patchFcm = params => {
  return httpsService.patch('/auth/update-token', params);
};
