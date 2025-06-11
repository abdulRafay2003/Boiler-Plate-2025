import {
  getHomeHeader,
  getPaginatedProjects,
  getProjectCategories,
  getProjectDetail,
  getFloorPlan, 
} from '../endPoints/home';

export const GetHomeHeader = async () => {
 
  return getHomeHeader().then(response => response?.data?.data);
};

export const GetProjectCategories = async () => {
  return getProjectCategories().then(response => response?.data?.data);
};

export const GetPaginatedProjects = async (page,category) => {
  return getPaginatedProjects(page,category).then(response => response?.data?.data);
};


export const GetProjectDetail = async (id) => {
  return getProjectDetail(id).then(response => response?.data?.data);
};

export const GetFloorPlan = async (id) => {
  return getFloorPlan(id).then(response => response?.data);
};
 