import httpsService from '@/services/mainServices/http.service';

export const getAllProjects = () => {
  return httpsService.get('/projects/v1/all?per_page=1000&page=1');
};
export const getAllProjectsId = () => {
  return httpsService.get('/projects/v1/all?fields=id');
};
export const getOneProjectVR = id => {
  return httpsService.get(`/projects/v1/virtual-tours?id=${id}`);
};
