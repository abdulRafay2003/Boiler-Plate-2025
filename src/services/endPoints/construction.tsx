import httpsService from '@/services/mainServices/http.service';

export const getConstructionList = (body) => {
  return httpsService.post(
    `/construction_update/v1/all`,
    body,
  );
};
export const getConstructionListDashboard = (perPage, pageNo, body) => {
  return httpsService.post(
    `/construction_update/v1/all?per_page=${perPage}&page=${pageNo}`,
    body,
  );
};
export const getConstructionDetail = id => {
  return httpsService.get(`/construction_update/v1/single?id=${id}`);
};
