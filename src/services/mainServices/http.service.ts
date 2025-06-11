import axios from 'axios';
import {
  BASE_URL,
  API_TIMEOUT,
  BASE_PATH_WP,
} from '@/services/mainServices/config';

const instance = axios.create({
  baseURL: BASE_URL + BASE_PATH_WP,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: 'Basic YWRtaW46WGIkJVB4Xm0qcllIazhwWWxvUk54ZDFS',
    Authorization: 'Basic YWRtaW46YWRtaW4xMjM=', //Live Auth Token
  },

  timeout: API_TIMEOUT,
});
export default instance;
