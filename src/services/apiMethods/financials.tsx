import { downPaymentStatus, getFianacialsListing, getPropertyDropDown, getUnitsByProperty, payment, paymentPlansbyId } from "../endPoints/financials";


export const FinancialsListingApi = async (payload) => {
    return getFianacialsListing(payload).then(response => response?.data?.data);
  };

  export const PropertyDropDownApi = async () => {
    return getPropertyDropDown().then(response => response?.data?.data);
  };

  export const UnitByPropertyDropDownApi = async (id) => {
    return getUnitsByProperty(id).then(response => response?.data?.data);
  };

  export const PaymentIntent = async (body) => {
    return payment(body).then(response => response?.data?.data);
  };

  export const PaymentPlanById = async (payload) => {
    return paymentPlansbyId(payload).then(response => response?.data?.data);
  };

  export const DownPaymentStatus = async (payload) => {
    return downPaymentStatus(payload).then(response => response?.data?.data);
  };