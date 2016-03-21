import Immutable from 'immutable';
import AsyncAction, { States as AsyncStates } from 'lib/AsyncAction';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import * as reducers from 'reducers';

function stateTransformer(state) {
  const serializedState = {};

  Object.keys(state).forEach(key => {
    serializedState[key] = state[key].toJSON();
  });

  return serializedState;
}

const logger = createLogger({
  stateTransformer
});

const asyncMiddleware = () => next => action => {
  if (action instanceof AsyncAction) {
    const { promise, ...others } = action;

    promise.then(payload => {
      if (payload.response) {
        return next({
          ...others,
          payload,
          response: payload.response,
          asyncState: AsyncStates.success
        });
      }

      return next({
        ...others,
        payload,
        asyncState: AsyncStates.success
      });

    }, error => {
      return next({
        ...others,
        error,
        asyncState: AsyncStates.failure
      });
    });

    return next({
      ...others,
      asyncState: AsyncStates.init
    });
  }

  next(action);
};

export default applyMiddleware(asyncMiddleware, logger)(createStore)(
  combineReducers({
    ...reducers
  })
);

// exports
export function getEntities(state, colId) {
  const collection = state.get(colId);
  return collection && collection.get('ids').map(id => state.get(`entities:${id}`));
}

export function isLoading(state, colId) {
  const collection = state.get(colId);
  return collection && collection.get('loading');
}

export function collectionFromEntities(entities) {
  return Immutable.fromJS({
    ids: entities.map(e => e.get('id')),
    loading: false
  });
}
