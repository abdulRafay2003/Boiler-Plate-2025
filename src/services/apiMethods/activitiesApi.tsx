import {
  dashboardActivity,
  getActivityDetail,
  getAllActivity,
} from '../endPoints/activitiesApi';

export const dashboardActivitiesApi = async () => {
  return dashboardActivity().then(response => response?.data);
};

export const getAllActivitiesApi = async params => {
  return getAllActivity(params).then(response => response?.data);
};

export const getActivitieDetailApi = async params => {
  return getActivityDetail(params).then(response => response?.data);
};
