import * as HttpApi from '../api/index';
import * as ActionTypes from '../actionTypes';

export const actionTypes = ActionTypes;


//////////////////
///// POST ///////
//////////////////
export const create = (params) => {
    return (dispatch) => {
        return HttpApi.post('eRESERV_PURCHASE_USER_CREATE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const createOptn = (params) => {
    return (dispatch) => {
        return HttpApi.post('eRESERV_PURCHASE_ADD_OPTN_USER_CREATE', params) // API 수정되어야 함
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
export const getDetail = (params) => {
    return (dispatch) => {
        return HttpApi.get('eRESERV_PURCHASE_USER_DETAIL', params) // API 수정되어야 함
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
