import httpsService from '@/services/mainServices/http.service';


export const getAboutUs = () => {
  return httpsService.get('/pages/v1/about');
};

export const getContactUs = () => {
    return httpsService.get('/pages/v1/contact');
  };

  export const getBlogListing = (page) => {
    return httpsService.get(`/blogs/v1/all?per_page=10&page=${page}`);
  };

  export const getBlogDetail = (id) => {
    return httpsService.get(`/blogs/v1/single?id=${id}`);
  };

