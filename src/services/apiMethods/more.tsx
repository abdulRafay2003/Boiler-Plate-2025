import { getAboutUs, getBlogDetail, getBlogListing, getContactUs } from "../endPoints/more";

  
  export const GetAboutUs = async () => {
    
    return  getAboutUs().then(response => response?.data?.data);
  };

  export const GetContactUs = async () => {
    
    return  getContactUs().then(response => response?.data?.data);
  };

  export const GetBlogListing = async (page) => {
    
    return  getBlogListing(page).then(response => response?.data?.data);
  };


  export const GetBlogDetail = async (id) => {
    
    return  getBlogDetail(id).then(response => response?.data?.data);
  };