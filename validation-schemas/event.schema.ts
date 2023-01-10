import * as yup from 'yup';

export const eventValidationScheme = yup.object({
  body: yup.object({
    name: yup.string().required(),
    description: yup.string().required(),
    gudelinnes: yup.string().required(),
    location: yup.string().required(),
    date: yup.date().required(),
    time: yup.string().required(),
    hasTimeFrame:yup.boolean().required(),
    timeFrame: yup.string().when('hasTimeFrame', {
      is: true,
      then: yup.string().required(),
      otherwise: yup.string().notRequired()
    })
  }),
});

