import httpsService from '@/services/mainServices/http.service';


export const getHomeHeader = () => {
  return httpsService.get('/pages/v1/header');
};

export const getProjectCategories = () => {
  return httpsService.get('/projects/v1/catagories');
};
export const getPaginatedProjects = (page,category) => {
  return httpsService.get(`/projects/v1/all?per_page=6&page=${page}&category=${category}`);
};

export const getProjectDetail = (id) => {
  return httpsService.get(`/projects/v1/single?id=${id}`);
};
export const getFloorPlan = (id) => {
  return httpsService.get(`/projects/v1/floor-plans?id=${id}`);
}; 