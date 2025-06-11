import { getPortfolioDetail, getPortfolioListing, getPortfolioListingDashboard } from "../endPoints/customerDashboard";

export const PortfoliListingDashboardApi = async () => {
    return getPortfolioListingDashboard().then(response => response?.data?.data);
  };
export const PortfoliListingApi = async (pageNo,pageSize) => {
    return getPortfolioListing(pageNo,pageSize).then(response => response?.data?.data);
  };

  export const PortfolioDetailApi = async (id) => {
    return getPortfolioDetail(id).then(response => response?.data?.data);
  };