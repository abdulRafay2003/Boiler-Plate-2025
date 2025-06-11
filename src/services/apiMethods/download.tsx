import {downloadBrouchers} from '../endPoints/download';

export const GetBrochure = async params => {

  return downloadBrouchers(params).then(response => response?.data?.data);
};
