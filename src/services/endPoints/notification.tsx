import httpsService from '@/services/mainServices/http.service';

export const requestRegisterDevice = payload => {
  return httpsService.post(`/notifications/v1/register`, payload);
};
export const requestGetNotifications = payload => {
  return httpsService.post(`/notifications/v1/all`, payload);
};
export const requestGetNotificationsPaginated = (pageNo, payload) => {
  return httpsService.post(
    `/notifications/v1/all?per_page=25&page=${pageNo}`,
    payload,
  );
};

export const requestMarkAsReadNotifications = payload => {
  return httpsService.post(`/notifications/v1/all/update`, payload);
};
export const requestReadOneNotifications = payload => {
  return httpsService.post(
    `/notifications/v1/all/update?status=1&id=${payload?.id}`,
    payload,
  );
};
export const resetNotificationCountWP = payload => {
  return httpsService.post(`/notifications/v1/count`, payload);
};
