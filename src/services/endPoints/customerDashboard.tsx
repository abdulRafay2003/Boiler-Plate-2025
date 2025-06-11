import httpsService from '@/services/mainServices/httpgj.service';


export const getPortfolioListingDashboard = () => {
    return httpsService.get(
      `/portfolio/latest`,
    );
  };
export const getPortfolioListing = (pageNo,pageSize) => {
    return httpsService.get(
      `/portfolio?pageNumber=${pageNo}&pageSize=${pageSize}`,
    );
  };


  export const getPortfolioDetail = (id) => {
    return httpsService.get(
      `/portfolio/detail/${id}`,
    );
  };