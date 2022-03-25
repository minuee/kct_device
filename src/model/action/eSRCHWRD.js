import * as HttpApi from '../api/index';
import * as ActionTypes from '../actionTypes';

export const actionTypes = ActionTypes;


//////////////////
///// POST ///////
//////////////////
export const create = (params) => {
    return (dispatch) => {
        return HttpApi.post('eSRCHWRD_MBER_USER_CREATE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const remove = (params) => {
    return (dispatch) => {
        return HttpApi.post('eSRCHWRD_MBER_USER_DELETE', params)
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
        return HttpApi.get('eSRCHWRD_MBER_USER_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const getTrendList = (params) => {
    return (dispatch) => {
        return HttpApi.get('eSRCHWRD_DD_SUM_USER_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

