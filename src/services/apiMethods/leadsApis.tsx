import {
  allLeadsSearch,
  dashboardLeads,
  leadDetail,
  leadPostStatus,
} from '../endPoints/leadsApis';

export const dashboardLeadsApi = async () => {
  return dashboardLeads().then(response => response?.data);
};

export const allLeadsSearchApi = async params => {
  return allLeadsSearch(params).then(response => response?.data);
};

export const LeadsDetailApi = async params => {
  return leadDetail(params).then(response => response?.data);
};

export const LeadsStatusApi = async body => {
  return leadPostStatus(body).then(response => response?.data);
};
