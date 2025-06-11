import httpsService from '@/services/mainServices/httpgj.service';

export const createNote = body => {
  return httpsService.post('/activity', body);
};
