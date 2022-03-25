import * as HttpApi from '../api/index';
import * as ActionTypes from '../actionTypes';

export const actionTypes = ActionTypes;

//////////////////
///// GET ///////
//////////////////
export const getSession = (params) => {
    return (dispatch) => {
        return HttpApi.get('eSESSION', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const setSession = (eSESSION) => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.eSESSION,
      eSESSION: eSESSION,
    });
  };
};

