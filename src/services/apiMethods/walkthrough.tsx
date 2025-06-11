import { getWalkThrough } from "../endPoints/walkthrough";

  
  export const GetWalkThrough = async () => {
    return  getWalkThrough().then(response => response?.data?.data);
  };