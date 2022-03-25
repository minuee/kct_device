import * as HttpApi from '../api/index';
import * as ActionTypes from '../actionTypes';

export const actionTypes = ActionTypes;


//////////////////
///// POST ///////
//////////////////


//////////////////
///// GET ///////
//////////////////
export const getAccList = (params) => {
    return (dispatch) => {
        return HttpApi.get('ePNT_ACCML_USER_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const getUseList = (params) => {
    return (dispatch) => {
        return HttpApi.get('ePNT_USE_USER_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
