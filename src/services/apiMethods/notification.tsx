import {
  requestRegisterDevice,
  requestGetNotifications,
  requestMarkAsReadNotifications,
  requestReadOneNotifications,
  requestGetNotificationsPaginated,
  resetNotificationCountWP,
} from '../endPoints/notification';

export const RegisterDevice = async payload => {
  return requestRegisterDevice(payload).then(response => response?.data);
};
export const GetNotifications = async payload => {
  return requestGetNotifications(payload).then(
    response => response?.data?.data?.notifications,
  );
};
export const GetNotificationsPaginated = async (pageNo, payload) => {
  return requestGetNotificationsPaginated(pageNo, payload).then(
    response => response?.data?.data,
  );
};
export const RequestMarkAsAllReadNotifications = async payload => {
  return requestMarkAsReadNotifications(payload).then(
    response => response?.data?.data,
  );
};

export const RequestReadOneNotification = async payload => {
  return requestReadOneNotifications(payload).then(
    response => response?.data?.data,
  );
};

export const ResetNotificationCountWP = async payload => {
  return resetNotificationCountWP(payload).then(response => response?.data);
};
