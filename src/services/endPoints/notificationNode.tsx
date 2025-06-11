import httpsService from '@/services/mainServices/httpgj.service';

export const requestNodeGetNotifications = () => {
  return httpsService.get(`/notification`);
};

export const requestNodePaginatedGetNotifications = pageNo => {
  return httpsService.get(`/notification?pageNumber=${pageNo}&pageSize=25`);
};

export const requestNodeMarkAsReadNotifications = () => {
  return httpsService.post(`/notification/all`);
};
export const requestNodeReadOneNotifications = payload => {
  return httpsService.post(`/notification`, payload);
};
export const resetNotificationCount = () => {
  return httpsService.get(`/notification/reset-notifications-count`);
};
