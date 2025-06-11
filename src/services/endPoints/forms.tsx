import httpsService from '@/services/mainServices/http.service';

export const requestForm = (formId,body) => {
  return httpsService.post(
    `/form/v1/submit?id=${formId}`,
    body,
    {
      headers: {
        timeout: 5000,
        Authorization: 'Basic YWRtaW46WGIkJVB4Xm0qcllIazhwWWxvUk54ZDFS',
        'Content-Type': 'multipart/form-data;',
      },
    },
  );
};
