import httpsService from '@/services/mainServices/httpgj.service';

export const postSignUp = body => {
  return httpsService.post('/auth/signup', body);
};

export const postLogin = body => {
  return httpsService.post('/auth/login', body);
};

export const postOtp = body => {
  return httpsService.post('/auth/otp-verify', body);
};

export const postLogOut = body => {
  return httpsService.post('/auth/logout', body);
};

export const postLogInSms = body => {
  return httpsService.post('/auth/login-sms', body);
};

export const resendOtp = body => {
  return httpsService.post('/auth/resend-otp', body);
};

export const updateProfilePic = body => {
  return httpsService.patch('/auth/edit-profile', body);
};
export const getProfilePicUrl = (name,token) => {
  return httpsService.get(`/file/signed-url?filename=${name}`,{
    headers:{
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
  }});
};
export const getUseProfile = () => {
  return httpsService.get('/auth/user');
};
export const deleteAccount = (body) => {
  return httpsService.post('/auth/request-account-deletion',body);
};
export const getAccountStatus = () => {
  return httpsService.get('/auth/account-deletion-status');
};
export const cancelAccountDeletion = () => {
  return httpsService.post('/auth/cancel-account-deletion');
};