import httpsService from '@/services/mainServices/http.service';
export const requestPrivacyPolicy = () => {
    return httpsService.get('privacy-policy');
  };

  export const requestTermsAndCondition = () => {
    return httpsService.get('terms-conditions');
  };