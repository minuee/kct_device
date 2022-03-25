import * as HttpApi from '../api/index';
import * as ActionTypes from '../actionTypes';

export const actionTypes = ActionTypes;


//////////////////
///// POST ///////
//////////////////
export const create = (params) => {
    return (dispatch) => {
        return HttpApi.post('eAUC_TRD_USER_CREATE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const update = (params) => {
    return (dispatch) => {
        return HttpApi.post('eAUC_TRD_USER_RE_BID', params)
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
        return HttpApi.get('eAUC_TRD_USER_DETAIL', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
