import theme from '@/assets/stylesheet/theme';
import moment from 'moment';

export const formatValue = number => {
  if (number != undefined) {
    const fixed = number?.toFixed(2);
    const numberString = fixed?.toString();
    const chars = numberString.split('');
    let commaCount = 0;
    let formattedNumber = '';
    for (let i = chars.length - 1; i >= 0; i--) {
      if (commaCount === 3 && i < chars.length - 1 && chars[i] !== '.') {
        formattedNumber = ',' + formattedNumber;
        commaCount = 0;
      }
      formattedNumber = chars[i] + formattedNumber;
      commaCount++;
    }
    if (formattedNumber.includes('.')) {
      let final = formattedNumber.replace(',.', '.');

      return final;
    } else {
      return formattedNumber;
    }
  }
};
export const isDateOlderThanCurrentDate = (invoiceStatus, givenDate) => {
  if (givenDate == null) {
    return '';
  } else {
    const currentDate = new Date();
    const given = new Date(givenDate);
    const diffInMilliseconds = currentDate - given;
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const millisecondsPerMonth = millisecondsPerDay * 30.44;
    const millisecondsPerYear = millisecondsPerDay * 365.25;

    if (
      invoiceStatus == 'Invoice : Open' &&
      diffInMilliseconds < millisecondsPerDay
    ) {
      return '';
    } else if (
      invoiceStatus == 'Invoice : Open' &&
      diffInMilliseconds < millisecondsPerMonth
    ) {
      const days = Math.floor(diffInMilliseconds / millisecondsPerDay);
      return `Overdue ${days} day${days !== 1 ? 's' : ''}`;
    } else if (
      invoiceStatus == 'Invoice : Open' &&
      diffInMilliseconds < millisecondsPerYear
    ) {
      const months = Math.floor(diffInMilliseconds / millisecondsPerMonth);
      return `Overdue ${months} month${months !== 1 ? 's' : ''}`;
    } else if (invoiceStatus != 'Invoice : Open') {
      return '';
    } else {
      const years = Math.floor(diffInMilliseconds / millisecondsPerYear);
      return `Overdue ${years} year${years !== 1 ? 's' : ''}`;
    }
  }
};

export const sortDate = (status, date) => {
  if (status == 'Invoice : Open' && date != null) {
    return moment(date).format('DD MMM YYYY');
  } else if (status == 'Invoice : Open' && date == null) {
    return '';
  } else if (status != 'Invoice : Open' && date == null) {
    return '';
  } else if (status != 'Invoice : Open' && date != null) {
    return moment(date).format('DD MMM YYYY');
  } else {
    return '';
  }
};

export const buttonText = status => {
  if (status == 'Invoice : Open') {
    return 'Pay Now';
  } else if (status == 'Invoice : Paid In Full') {
    return 'Paid';
  }
  // else if (status == 'Invoice : Close') {
  //   return 'Closed';
  // }
  else if (status == 'Invoice : Processing') {
    return 'Processing';
  }
  // else if (status == 'Invoice : Rejected') {
  //   return 'Rejected';
  // }
  else {
    return '';
  }
};

export const buttonBackgroundColor = status => {
  if (status == 'Invoice : Open') {
    return theme?.logoColor;
  } else if (status == 'Invoice : Paid In Full') {
    return theme?.lightGreen;
  }
  // else if (status == 'Invoice : Close') {
  //   return theme?.brightRed;
  // }
  else if (status == 'Invoice : Processing') {
    return theme?.yellow;
  }
  // else if (status == 'Invoice : Rejected') {
  //   return theme?.brightRed;
  // }
  else {
    return theme?.white;
  }
};
export const buttonHeight = status => {
  if (status == 'Invoice : Open') {
    return 26;
  } else if (status == 'Invoice : Paid In Full') {
    return 24;
  } else if (status == 'Invoice : Close') {
    return 24;
  } else if (status == 'Invoice : Processing') {
    return 24;
  } else if (status == 'Invoice : Rejected') {
    return 24;
  } else {
    return 0;
  }
};
export const buttonWidth = status => {
  if (status == 'Invoice : Open') {
    return 78;
  } else if (status == 'Invoice : Paid In Full') {
    return 75;
  }
  //  else if (status == 'Invoice : Close') {
  //   return 75;
  // }
  else if (status == 'Invoice : Processing') {
    return 75;
  }
  // else if (status == 'Invoice : Rejected') {
  //   return 75;
  // }
  else {
    return 0;
  }
};

export const paymentPlanStatus = status => {
  if (status == 'Open') {
    return true;
  } else {
    return false;
  }
};
export const paymentPlanBC = (duedate, days) => {
  let dueDate = moment(duedate).format('YYYY-MM-DD');
  if (moment(dueDate).diff(new Date(), 'days') + 1 > days) {
    return true;
  } else {
    return false;
  }
};
export const statmentOfAccLink = url => {
  if (url != null && url != undefined && url != '') {
    return true;
  } else {
    return false;
  }
};
export const invoiceLink = url => {
  if (url != null && url != undefined && url != '') {
    return true;
  } else {
    return false;
  }
};
export const fianacialpaymentRecieptLink = (url, status) => {
  if (
    url != null &&
    url != undefined &&
    url != '' &&
    (status == 'Invoice : Paid In Full' || status == 'Invoice : Close')
  ) {
    return true;
  } else {
    return false;
  }
};
export const paymentRecieptLink = (
  // url,
  arr,
  status,
) => {
  if (arr?.length > 0 && status == 'Paid') {
    let fArr = [];
    arr?.map(item => {
      if (
        item?.paymentPrd?.paymentRecieptUrl != null &&
        item?.paymentPrd?.paymentRecieptUrl != undefined &&
        item?.paymentPrd?.paymentRecieptUrl != ''
      ) {
        fArr.push(item);
      }
    });
    if (fArr?.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  // else if (url != null && url != undefined && url != '' && status == 'Paid') {
  //   return true;
  // }
  else {
    return false;
  }
};
export const FilterPaymentPrdLinkage = arr => {
  let fArr = [];
  arr?.map(item => {
    if (
      item?.paymentPrd?.paymentRecieptUrl != null &&
      item?.paymentPrd?.paymentRecieptUrl != undefined &&
      item?.paymentPrd?.paymentRecieptUrl != ''
    ) {
      fArr.push(item);
    }
  });
  if (fArr?.length > 0) {
    return fArr;
  } else {
    return fArr;
  }
};
export const dashboardFinancialListingHeight = (
  createdAt,
  dueDate,
  paymentDate,
) => {
  if (createdAt != null && dueDate != null && paymentDate != null) {
    return 200;
  } else if (createdAt != null && dueDate == null && paymentDate == null) {
    return 160;
  } else if (createdAt == null && dueDate != null && paymentDate == null) {
    return 160;
  } else if (createdAt == null && dueDate == null && paymentDate != null) {
    return 160;
  } else if (createdAt != null && dueDate != null && paymentDate == null) {
    return 160;
  } else if (createdAt == null && dueDate != null && paymentDate != null) {
    return 160;
  } else {
    return 160;
  }
};

export const projectDescription = projectDetailsNode => {
  if (
    projectDetailsNode?.property?.type != undefined &&
    projectDetailsNode?.property?.markettingName != undefined &&
    projectDetailsNode?.property?.buildingAddress != undefined
  ) {
    return `${
      projectDetailsNode?.property?.type?.charAt(0).toUpperCase() +
      projectDetailsNode?.property?.type?.slice(1)?.toLowerCase()
    } | ${projectDetailsNode?.property?.markettingName} - ${
      projectDetailsNode?.property?.buildingAddress
    }`;
  } else if (
    projectDetailsNode?.property?.type != undefined &&
    projectDetailsNode?.property?.markettingName == undefined &&
    projectDetailsNode?.property?.buildingAddress == undefined
  ) {
    return `${
      projectDetailsNode?.property?.type?.charAt(0).toUpperCase() +
      projectDetailsNode?.property?.type?.slice(1)?.toLowerCase()
    }`;
  } else if (
    projectDetailsNode?.property?.type == undefined &&
    projectDetailsNode?.property?.markettingName != undefined &&
    projectDetailsNode?.property?.buildingAddress == undefined
  ) {
    return `${projectDetailsNode?.property?.markettingName}`;
  } else if (
    projectDetailsNode?.property?.type == undefined &&
    projectDetailsNode?.property?.markettingName == undefined &&
    projectDetailsNode?.property?.buildingAddress != undefined
  ) {
    return `${projectDetailsNode?.property?.buildingAddress}`;
  } else if (
    projectDetailsNode?.property?.type == undefined &&
    projectDetailsNode?.property?.markettingName != undefined &&
    projectDetailsNode?.property?.buildingAddress != undefined
  ) {
    return `${projectDetailsNode?.property?.markettingName} - ${projectDetailsNode?.property?.buildingAddress}`;
  } else if (
    projectDetailsNode?.property?.type != undefined &&
    projectDetailsNode?.property?.markettingName == undefined &&
    projectDetailsNode?.property?.buildingAddress != undefined
  ) {
    return `${
      projectDetailsNode?.property?.type?.charAt(0).toUpperCase() +
      projectDetailsNode?.property?.type?.slice(1)?.toLowerCase()
    } - ${projectDetailsNode?.property?.buildingAddress}`;
  } else if (
    projectDetailsNode?.property?.type != undefined &&
    projectDetailsNode?.property?.markettingName != undefined &&
    projectDetailsNode?.property?.buildingAddress == undefined
  ) {
    return `${
      projectDetailsNode?.property?.type?.charAt(0).toUpperCase() +
      projectDetailsNode?.property?.type?.slice(1)?.toLowerCase()
    } | ${projectDetailsNode?.property?.markettingName}`;
  } else if (
    projectDetailsNode?.property?.type == undefined &&
    projectDetailsNode?.property?.markettingName == undefined &&
    projectDetailsNode?.property?.buildingAddress != undefined
  ) {
    return `${projectDetailsNode?.property?.buildingAddress}`;
  } else {
    return ``;
  }
};

export const finalAmountPaymentPlan = (breakDown, paymentValue) => {
  // console.log('dsfxghjk', breakDown);

  let arr = [];
  // if (breakDown?.totalTax > 0) {
  //   arr.push('This price includes VAT');
  // }
  arr.push({
    key: 'Installment Amount',
    value: formatValue(paymentValue),
  });
  if (breakDown?.chequeCancellation > 0) {
    arr.push({
      key: 'Cheque Cancellation fee',
      value: formatValue(breakDown?.chequeCancellation),
    });
  }

  if (breakDown?.latePaymentFeePaymentPlan > 0) {
    arr.push({
      key: 'Late payment fee',
      value: formatValue(breakDown?.latePaymentFeePaymentPlan),
    });
  }
  if (breakDown?.processingFeePaymentPlanActualValue > 0) {
    arr.push({
      key: 'Processing fee',
      value: formatValue(breakDown?.processingFeePaymentPlanActualValue),
    });
  }
  arr.push({
    key: 'Total Amount',
    value: formatValue(breakDown?.totalAmt),
  });
  if (arr?.length > 0) {
    // arr[arr.length - 1] = arr[arr.length - 1].replace(',', ' and');
    // arr.push('.');
    // let arrJoin = arr.join('');
    // let text = arrJoin.toString();

    return {
      object: {
        main: arr,
        note: `Any previously unpaid installment(s) will be adjusted before validating this installment.`,
      },
      state: true,
    };
  } else {
    return {
      object: {
        main: [],
        note: `Any previously unpaid installment(s) will be adjusted before validating this installment.`,
      },
      state: true,
    };
  }
};
export const finalAmountFinancials = (breakDown, paymentValue) => {
  // console.log('dsfxghjk', breakDown);
  let arr = [];
  arr.push({
    key: 'Financial Amount',
    value: formatValue(paymentValue),
  });
  if (breakDown?.latePaymentFeeFinancial > 0) {
    arr.push({
      key: 'Late payment fee',
      value: formatValue(breakDown?.latePaymentFeeFinancial),
    });
  }
  if (breakDown?.processingFeeFinancialValue > 0) {
    arr.push({
      key: 'Processing fee',
      value: formatValue(breakDown?.processingFeeFinancialValue),
    });
  }
  arr.push({
    key: 'Total Amount',
    value: formatValue(breakDown?.totalAmt),
  });
  // arr.push('This price includes ');
  // if (breakDown?.processingFeeFinancial > 0) {
  //   arr.push(
  //     `Processing fee: ${formatValue(breakDown?.processingFeeFinancial)} AED`,
  //   );
  // }
  // if (breakDown?.latePaymentFeeFinancial > 0) {
  //   arr.push(
  //     `Late payment fee: ${formatValue(
  //       breakDown?.latePaymentFeeFinancial,
  //     )} AED`,
  //   );
  // }
  if (arr?.length > 0) {
    // arr[arr.length - 1] = arr[arr.length - 1].replace(',', ' and');
    // arr.push('.');
    // let arrJoin = arr.join('');
    // let text = arrJoin.toString();
    return {text: arr, state: true};
  } else {
    return {text: [], state: true};
  }
};
