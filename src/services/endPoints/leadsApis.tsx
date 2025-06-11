import httpsService from '@/services/mainServices/httpgj.service';
import dataHandlerService from '../mainServices/dataHandler.service';
import {Alert} from 'react-native/types';

export const dashboardLeads = () => {
  return httpsService.get('/lead/latest');
};

export const allLeadsSearch = params => {
  return httpsService.get(`/lead${params}`);
};

export const leadDetail = params => {
  return httpsService.get(`/lead/detail/${params?.id}`);
};

export const leadPostStatus = body => {
  return httpsService.post('/lead/action', body);
};
