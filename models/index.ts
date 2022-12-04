import { User } from './user-model';
import { Event } from './events-model';
import { UserEvents } from './user-events';

export const dataBase = {
  User,
  Event,
  UserEvents,
};

// user user-events relation
User.hasMany(UserEvents, { as: 'userEvents', foreignKey: 'userID' }); //user-@ kara unena shat user event, user ID mana galu user events i het
UserEvents.belongsTo(User, { as: 'user', foreignKey: 'userID' }); //userEventy patkanume User

Event.hasMany(UserEvents, { as: 'userEvents', foreignKey: 'eventID' });
UserEvents.belongsTo(Event, { as: 'event', foreignKey: 'eventID' });
