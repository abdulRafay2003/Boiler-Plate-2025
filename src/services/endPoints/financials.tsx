import httpsService from '@/services/mainServices/httpgj.service';


export const getFianacialsListing = (payload) => {
    return httpsService.get(
      `/financial${payload}`,
    )
}

export const getPropertyDropDown = () => {
    return httpsService.get(
      `/property`,
    )
}

export const getUnitsByProperty = (id) => {
    return httpsService.get(
      `/unit/${id}`,
    )
}

export const payment = (body) => {
  return httpsService.post(
    `/payment/request`,body
  )
}

export const paymentPlansbyId = (payload) => {
  return httpsService.get(
    `/payment/${payload}`
  )
}
export const downPaymentStatus = (payload) => {
  return httpsService.get(
    `/payment/downpayment/${payload}`
  )
}