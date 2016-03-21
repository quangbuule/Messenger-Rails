import Immutable from 'immutable';
import { collectionFromEntities } from 'lib/store';
import { States as AsyncStates } from 'lib/AsyncAction';

const initialState = new Immutable.Map;

export default function (state = initialState, action) {
  switch (action.type) {
  case '@@conversation/getAll':
    if (action.asyncState === AsyncStates.success) {
      const { conversationCollectionId = 'all' } = action;
      const { body: rawconversations } = action.payload;
      const full = action.payload.headers['x-full'];
      const conversations = Immutable.fromJS(rawconversations);

      conversations.forEach(conversation => {
        const conversationId = conversation.get('id');
        state = state.set(`entities:${conversationId}`, conversation);
      });

      state = state.set(`collections:${conversationCollectionId}`,
        collectionFromEntities(conversations).set('full', full));
    }

    break;

  case '@@message/getAll':
    break;
  }
  return state;
}
