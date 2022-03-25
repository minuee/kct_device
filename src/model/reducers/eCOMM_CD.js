import * as ActionTypes from "../actionTypes";

export const initialState = {
    eCOMM_CD: null,
    eCOMM_CD_TYPE: null,
};

export const eCOMM_CD_reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.eCOMM_CD:
            return Object.assign({}, state, { eCOMM_CD: action.eCOMM_CD });
        case ActionTypes.eCOMM_CD_TYPE:
            return Object.assign({}, state, { eCOMM_CD_TYPE: action.eCOMM_CD_TYPE });
        default:
            return state;
    }
};
