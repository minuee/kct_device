import * as HttpApi from '../api/index';
import * as ActionTypes from '../actionTypes';

export const actionTypes = ActionTypes;


//////////////////
///// POST ///////
//////////////////
export const createInqry = (params) => {
    return (dispatch) => {
        return HttpApi.post('eGOODS_INQRY_USER_CREATE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const updateInqry = (params) => {
    return (dispatch) => {
        return HttpApi.post('eGOODS_INQRY_USER_UPDATE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const removeInqry = (params) => {
    return (dispatch) => {
        return HttpApi.post('eGOODS_INQRY_USER_DELETE', params)
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
export const getInqryList = (params) => {
    return (dispatch) => {
        return HttpApi.get('eGOODS_INQRY_USER_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const getInqryDetail = (params) => {
    return (dispatch) => {
        return HttpApi.get('eGOODS_INQRY_USER_DETAIL', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
