import {getConfigApi} from '../endPoints/configApi';

export const GetConfigApi = async () => {
  return getConfigApi().then(response => response?.data);
};
