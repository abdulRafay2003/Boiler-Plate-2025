import axios from 'axios';
import {BASE_URL_GJ, API_TIMEOUT} from '@/services/mainServices/config';
import dataHandlerService from './dataHandler.service';
import { store } from '@/redux/store';

const instance = axios.create({
  baseURL: BASE_URL_GJ,
  headers: {
    'Content-Type': 'application/json',
  },

  timeout: API_TIMEOUT,
});
instance.interceptors.request.use(async config => {
  console.log(
    'token Get',
    store.getState()?.user?.userDetail?.token
      ?.access_token,
  );

  var token = store.getState()?.user?.userDetail
    ?.token?.access_token;

  if (token) {
    config.headers = {...config.headers, Authorization: 'Bearer ' + token};
  } else {
    config.headers = {...config.headers};
  }
  return config;
});

export default instance;
