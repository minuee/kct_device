import * as HttpApi from '../api/index';
import * as ActionTypes from '../actionTypes';

export const actionTypes = ActionTypes;


//////////////////
///// POST ///////
//////////////////
export const createView = (params) => {
    return (dispatch) => {
        return HttpApi.post('eBANNER_USER_VIEW_UPDATE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

//////////////////
///// GET ///////
//////////////////
export const getList = (params) => {
    return (dispatch) => {
        return HttpApi.get('eBANNER_USER_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
