import Immutable from 'immutable';
import { collectionFromEntities } from 'lib/store';
import { States as AsyncStates } from 'lib/AsyncAction';

const initialState = new Immutable.Map;

export default function (state = initialState, action) {
  switch (action.type) {
  case '@@user/getAll':
    if (action.asyncState === AsyncStates.success) {
      const { userCollectionId = 'all' } = action;
      const { body: rawUsers } = action.payload;
      const full = action.payload.headers['x-full'];
      const users = Immutable.fromJS(rawUsers);

      users.forEach(user => {
        const userId = user.get('id');
        state = state.set(`entities:${userId}`, user);
      });

      state = state.set(`collections:${userCollectionId}`,
        collectionFromEntities(users).set('full', full));
    }

    break;

  case '@@user/addFriend':
    const { userId } = action;
    state = state.update(`entities:${userId}`, user => user.set('is_friend', true));
    break;
  }
  return state;
}
