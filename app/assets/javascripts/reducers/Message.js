import Immutable from 'immutable';
import { collectionFromEntities } from 'lib/store';
import { States as AsyncStates } from 'lib/AsyncAction';

const initialState = new Immutable.Map;

export default function (state = initialState, action) {
  switch (action.type) {
  case '@@message/getAll':
    if (action.asyncState === AsyncStates.success) {
      const { messageCollectionId } = action;
      const { body: rawMessages } = action.payload;
      const full = action.payload.headers['x-full'];
      const messages = Immutable.fromJS(rawMessages);

      messages.forEach(message => {
        const messageId = message.get('id');
        state = state.set(`entities:${messageId}`, message);
      });

      state = state.set(`collections:${messageCollectionId}`,
        collectionFromEntities(messages).set('full', full));
    }

    break;
  }
  return state;
}
