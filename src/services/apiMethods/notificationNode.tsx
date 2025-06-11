import {
  requestNodeGetNotifications,
  requestNodeMarkAsReadNotifications,
  requestNodePaginatedGetNotifications,
  requestNodeReadOneNotifications,
  resetNotificationCount,
} from '../endPoints/notificationNode';

export const GetNodeNotifications = async () => {
  return requestNodeGetNotifications().then(response => response?.data?.data);
};

export const GetNodePaginatedNotifications = async pageNo => {
  return requestNodePaginatedGetNotifications(pageNo).then(
    response => response?.data?.data,
  );
};

export const RequestNodeMarkAsAllReadNotifications = async () => {
  return requestNodeMarkAsReadNotifications().then(
    response => response?.data?.data,
  );
};

export const RequestNodeReadOneNotification = async payload => {
  return requestNodeReadOneNotifications(payload).then(
    response => response?.data?.data,
  );
};
export const ResetNotificationCount = async () => {
  return resetNotificationCount().then(response => response?.data);
};
