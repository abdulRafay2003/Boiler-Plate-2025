import {getDropDownData} from '../endPoints/dropDown';

export const getAllDropDownApi = async () => {
  return getDropDownData().then(response => response?.data);
};
