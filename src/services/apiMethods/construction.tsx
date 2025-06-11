import { getConstructionDetail, getConstructionList, getConstructionListDashboard } from "../endPoints/construction";


export const ConstructionListApi = async (body) => {
  return getConstructionList(body).then(response => response?.data?.data);
}
export const ConstructionListApiDashboard = async (perPage,pageNo,body) => {
  return getConstructionListDashboard(perPage,pageNo,body).then(response => response?.data?.data);
}
export const ConstructionDetailApi = async id => {
    return getConstructionDetail(id).then(response => response?.data?.data);
  }