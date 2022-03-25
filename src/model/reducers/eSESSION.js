import * as ActionTypes from "../actionTypes";

export const initialState = {
  eSESSION: { type: 1 },
  UUID: null,
};

export const eSESSION_reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.eSESSION:
      return Object.assign({}, state, { eSESSION: action.eSESSION });
    case ActionTypes.eSESSION_ADMIN:
      return Object.assign({}, state, { eSESSION: action.eSESSION });
    case ActionTypes.UUID:
      return Object.assign({}, state, { UUID: action.UUID });
    default:
      return state;
  }
};
