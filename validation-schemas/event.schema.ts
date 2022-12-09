import * as yup from 'yup';

export const eventValidationScheme = yup.object({
  body: yup.object({
    name: yup.string().required(),
    dateTime: yup.string().required(),
    description: yup.string().required(),
    endDate: yup.string().required(),
    eventType: yup.string().required(),
    gudelinnes: yup.string().required(),
    location: yup.string().required(),
  }),
});
