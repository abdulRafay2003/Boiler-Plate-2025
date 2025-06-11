import { requestForm } from "../endPoints/forms";


export const SubmitForm = async (formId,body) => {

    return requestForm(formId,body).then(response => response?.data?.data);
  };