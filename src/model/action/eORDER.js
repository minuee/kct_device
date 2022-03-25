import * as HttpApi from '../api/index';
import * as ActionTypes from '../actionTypes';

export const actionTypes = ActionTypes;


//////////////////
///// POST ///////
//////////////////


//////////////////
///// GET ///////
//////////////////
export const getCount = (params) => {
    return (dispatch) => {
        return HttpApi.get('eORDER_USER_COUNT', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const getList = (params) => {
    return (dispatch) => {
        return HttpApi.get('eORDER_USER_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
