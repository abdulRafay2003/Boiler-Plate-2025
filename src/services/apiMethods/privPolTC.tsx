import { requestPrivacyPolicy,requestTermsAndCondition } from "../endPoints/privPolTC";


export const RequestPrivacyPolicy = async () => {
    
    return requestPrivacyPolicy().then(response => response?.data);
  };

  export const RequestTermsAndCondition = async () => {
    
    return requestTermsAndCondition().then(response => response?.data);
  };