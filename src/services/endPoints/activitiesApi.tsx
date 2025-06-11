import httpsService from '@/services/mainServices/httpgj.service';

export const dashboardActivity = () => {
  return httpsService.get('/activity/latest');
};

export const getAllActivity = params => {
  return httpsService.get(`/activity${params}`);
};

export const getActivityDetail = params => {
  return httpsService.get(`/activity/lead/${params}`);
};
