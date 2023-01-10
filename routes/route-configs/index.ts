export const endpoints = {
  event: {
    paths: {
      delete: `/events/:eventID`,
      update: `/events/:eventID`,
      getEvents: `/events`,
      getEvent: `/event/:eventID`,
      getUserEvents: `/events/user-events`,
      create: `/events/create`,
      attende: `/events/attende/:eventID`,
    },
  },
  user: {
    paths: {
      getLinkedinAuthorizeUrl: `/linkedin/authorize/url`,
      authorize: `/linkedin/authorize`,
      user: `/user`
    },
  },
};
