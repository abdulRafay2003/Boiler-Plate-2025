import {patchFcm} from '../endPoints/updateFcm';

export const updateFcmApi = async params => {
  return patchFcm(params).then(response => response?.data?.data);
};
