import * as yup from 'yup';

const phoneRegExp = /^()?(?:50|51|52|54|55|56|58|2|3|4|6|7|9)\d{7}$/;
const num = /^(?:[0-9]●?){8,9}[0-9]$/;
const date =
  /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

let emailreg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
const space = /^\S*$/;
// const passwordValid = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$/;
const passwordValid =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&.]{8,}$/;

const emailSpace = /^[+A-Za-z0-9_@.]+$/;
const numvalid = /^[0-9]+$/;
const emiratesID = /^[0-9]{3}-?[0-9]{4}-?[0-9]{7}-?[0-9]{1}$/;
const textReg = /^[a-zA-Z\s]*$/;
let emailreg2 = /^[a-zA-Z0-9][^\s@]*@[^\s@]+\.[^\s@]+$/;

const checktiming = () => {
  let starttime = new Date();
  let endTime = new Date();
  if (starttime > endTime) {
    return;
  }
};
const LoginEmailValidation = yup.object().shape({
  email: yup
    .string()
    .matches(emailreg2, 'Please enter valid email address')
    .required('The field is required.'),
});
const LoginPhoneValidation = yup.object().shape({
  phone: yup
    .string()
    .required('The field is required.')
    .matches(numvalid, 'Invalid number.')
    .min(7, 'Minimum 7 digits.')
    .max(15, 'Maximum 15 digits.'),
});
const NoteLogsValidation = yup.object().shape({
  title: yup
    .string()
    .max(51, 'Maximum 45 Digits Title')
    .required('The field is required.'),
  desc: yup.string().required('The field is required.'),
  startDate: yup.string().optional(),
  time: yup.string().optional(),
  typeLable: yup.string().optional(),
  directionLable: yup.string().optional(),
  selectedLeadsArray: yup?.array().min(1, 'The field is required.'),
});
const CallLogsValidation = yup.object().shape({
  title: yup
    .string()
    .max(51, 'Maximum 45 Digits Title')
    .required('The field is required.'),
  desc: yup.string().required('The field is required.'),
  phone: yup
    .string()
    .optional()
    .nullable()
    .test('valid-number', 'Min 7 or Max 10 Digits Number', value => {
      if (!value) {
        return true;
      }
      return /^[0-9]{7,10}$/.test(value);
    }),
  date: yup.string().optional().nullable(),
  time: yup.string().optional().nullable(),
  endTime: yup.string().when(['time'], (time, schema) => {
    return time
      ? schema.test({
          test: endTime => !endTime || new Date(endTime) > new Date(time),
          message: 'End time must be greater than start time.',
        })
      : schema;
  }),
  selectedLeadsArray: yup?.array().min(1, 'The field is required.'),
  typeLable: yup.string().optional(),
});
const EventLogsValidation = yup.object().shape({
  title: yup
    .string()
    .max(51, 'Maximum 45 Digits Title')
    .required('The field is required.'),
  date: yup.string().optional(),
  time: yup.string().optional().nullable(),
  endTime: yup.string().when(['time'], (time, schema) => {
    return time
      ? schema.test({
          test: endTime => !endTime || new Date(endTime) > new Date(time),
          message: 'End time must be greater than start time.',
        })
      : schema;
  }),
  desc: yup.string().required('The field is required.'),
  location: yup.string().optional(),
  typeLable: yup.string().optional(),
  directionLable: yup.string().optional(),
  selectedLeadsArray: yup?.array().min(1, 'The field is required.'),
});
const TaskLogsValidation = yup.object().shape({
  title: yup
    .string()
    .max(51, 'Maximum 45 Digits Title')
    .required('The field is required.'),
  date: yup.string().optional(),
  desc: yup.string().required('The field is required.'),
  time: yup.string().optional().nullable(),
  endTime: yup.string().when(['time'], (time, schema) => {
    return time
      ? schema.test({
          test: endTime => !endTime || new Date(endTime) > new Date(time),
          message: 'End time must be greater than start time.',
        })
      : schema;
  }),
  typeLable: yup.string().optional(),
  selectedLeadsArray: yup?.array().min(1, 'The field is required.'),
});
const SignupValidation = yup.object().shape({
  email: yup
    .string()
    .matches(emailreg2, 'Please enter valid email address')
    .required('The field is required.'),
  phone: yup
    .string()
    .required('The field is required.')
    .matches(numvalid, 'Invalid number.')
    .min(7, 'Minimum 7 digits.')
    .max(15, 'Maximum 15 digits.'),
});
const ContactUsValidation = yup.object().shape({
  firstName: yup
    .string()
    .matches(textReg, 'Special character & numbers is not allowed.')
    .required('The field is required.'),
  // lastName: yup.string().required('The field is required.'),
  email: yup
    .string()
    .matches(emailreg2, 'Please enter valid email address')
    .required('The field is required.'),
  phone: yup
    .string()
    .required('The field is required.')
    .matches(numvalid, 'Invalid number.')
    .min(7, 'Minimum 7 digits.')
    .max(15, 'Maximum 15 digits.'),
  queryMessage: yup.string().required('The field is required.'),
  inquiryLable: yup.string().required('The field is required.'),
});
const AddUserValidation = yup.object().shape({
  firstName: yup
    .string()
    .matches(textReg, 'Special character & numbers is not allowed.')
    .required('The field is required.'),
  email: yup
    .string()
    .matches(emailreg2, 'Please enter valid email address')
    .required('The field is required.'),
  phone: yup
    .string()
    .required('The field is required.')
    .matches(numvalid, 'Invalid number.')
    .min(7, 'Minimum 7 digits.')
    .max(15, 'Maximum 15 digits.'),
});
const EnquiryFormValidation = yup.object().shape({
  fullName: yup
    .string()
    .matches(textReg, 'Special character & numbers is not allowed.')
    .required('The field is required.'),
  email: yup
    .string()
    .matches(emailreg2, 'Please enter valid email address')
    .required('The field is required.'),
  // .required('The field is required.')
  phone: yup
    .string()
    .required('The field is required.')
    .matches(numvalid, 'Invalid number.')
    .min(7, 'Minimum 7 digits.')
    .max(15, 'Maximum 15 digits.'),
});
const DownloadBrouchureFormValidation = yup.object().shape({
  fullName: yup
    .string()
    .matches(textReg, 'Special character & numbers is not allowed.')
    .required('The field is required.'),
  email: yup
    .string()
    .matches(emailreg2, 'Please enter valid email address')
    .required('The field is required.'),
  // .required('The field is required.')
  phone: yup
    .string()
    .required('The field is required.')
    .matches(numvalid, 'Invalid number.')
    .min(7, 'Minimum 7 digits.')
    .max(15, 'Maximum 15 digits.'),
});
const ApplyMortageValidation = yup.object().shape({
  fullName: yup
    .string()
    .matches(textReg, 'Special character & numbers is not allowed.')
    .required('The field is required.'),
  email: yup
    .string()
    .matches(emailreg2, 'Please enter valid email address')
    .required('The field is required.'),
  phone: yup
    .string()
    .required('The field is required.')
    .matches(numvalid, 'Invalid number.')
    .min(7, 'Minimum 7 digits.')
    .max(15, 'Maximum 15 digits.'),
  companyName: yup
    .string()
    .matches(textReg, 'Special character & numbers is not allowed.')
    .required('The field is required.'),
  salary: yup
    .string()
    .required('The field is required.')
    .matches(numvalid, 'Only digits allowed.'),
});

const MortageCalculatorValidation = yup.object().shape({
  propertPrice: yup.string().required('The field is required.'),
});
const ReasonValidation = yup.object().shape({
  reason: yup.string().required('The field is required.'),
});
export {
  ContactUsValidation,
  EnquiryFormValidation,
  ApplyMortageValidation,
  MortageCalculatorValidation,
  DownloadBrouchureFormValidation,
  AddUserValidation,
  SignupValidation,
  LoginEmailValidation,
  LoginPhoneValidation,
  NoteLogsValidation,
  EventLogsValidation,
  TaskLogsValidation,
  CallLogsValidation,
  ReasonValidation,
};
