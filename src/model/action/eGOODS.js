import * as HttpApi from '../api/index';
import * as ActionTypes from '../actionTypes';

export const actionTypes = ActionTypes;


//////////////////
///// POST ///////
//////////////////

//////////////////
///// GET ///////
//////////////////
export const getMainList = (params) => {
    return (dispatch) => {
        return HttpApi.get('eGOODS_USER_MAIN_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const getMainStoreList = (params) => {
    return (dispatch) => {
        return HttpApi.get('eGOODS_USER_STORE_MAIN_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const getStoreList = (params) => {
    return (dispatch) => {
        return HttpApi.get('eGOODS_USER_STORE_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const getStoreDetail = (params) => {
    return (dispatch) => {
        return HttpApi.get('eGOODS_USER_STORE_DETAIL', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const getSearchList = (params) => {
    return (dispatch) => {
        return HttpApi.get('eGOODS_USER_SEARCH_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
