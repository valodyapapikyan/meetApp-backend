export const endpoints = {
  event: {
    paths: {
      delete: `/events/:eventID`,
      update: `/events/:eventID`,
      getEvents: `/events`,
      getUserEvents: `/events/user-events`,
      create: `/events/create`,
      attende: `/events/attende/:eventID`,
    },
  },
  user: {
    paths: {
      getLinkedinAuthorizeUrl: `/linkedin/authorize/url`,
      authorize: `/linkedin/authorize`,
    },
  },
};
