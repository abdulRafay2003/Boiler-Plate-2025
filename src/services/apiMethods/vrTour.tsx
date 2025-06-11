import { getAllProjects, getAllProjectsId, getOneProjectVR } from "../endPoints/vrTour";

  
  export const GetAllProjects = async () => {
    
    return  getAllProjects().then(response => response?.data?.data?.projects);
  };
  export const GetAllProjectsIDs = async () => {
    
    return  getAllProjectsId().then(response => response?.data?.data?.projects);
  };
  export const GetOneProjectVR = async (id) => {
    
    return  getOneProjectVR(id).then(response => response?.data?.data);
  };