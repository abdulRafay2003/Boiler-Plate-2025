import {
  cancelAccountDeletion,
  deleteAccount,
  getAccountStatus,
  getProfilePicUrl,
  getUseProfile,
  postLogInSms,
  postLogOut,
  postLogin,
  postOtp,
  postSignUp,
  resendOtp,
  updateProfilePic,
} from '../endPoints/authApis';

export const postSignUpApi = async body => {
  return postSignUp(body).then(response => response);
};

export const postLoginApi = async body => {
  return postLogin(body).then(response => response?.data);
};

export const postOtpVerifyApi = async body => {
  return postOtp(body).then(response => response?.data);
};

export const postLogOutVerifyApi = async body => {
  return postLogOut(body).then(response => response?.data);
};

export const postLogInSmsApi = async body => {
  return postLogInSms(body).then(response => response?.data);
};
export const resendOtpApi = async body => {
  return resendOtp(body).then(response => response?.data);
};
export const updateProfilePicApi = async body => {
  return updateProfilePic(body).then(response => response?.data?.data);
};
export const getProfilePicUrlApi = async (body,token) => {
  return getProfilePicUrl(body,token).then(response => response?.data?.data);
};
export const getUserProfileApi = async () => {
  return getUseProfile().then(response => response?.data?.data);
};
export const DeleteAccountApi = async (body) => {
  return deleteAccount(body).then(response => response?.data);
};
export const getAccountStatusApi = async () => {
  return getAccountStatus().then(response => response?.data?.data);
};
export const cancelAccountDeletionApi = async () => {
  return cancelAccountDeletion().then(response => response?.data);
};