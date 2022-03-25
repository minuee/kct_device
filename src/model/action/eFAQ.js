import * as HttpApi from '../api/index';
import * as ActionTypes from '../actionTypes';

export const actionTypes = ActionTypes;


//////////////////
///// POST ///////
//////////////////

//////////////////
///// GET ///////
//////////////////
export const getList = (params) => {
    return (dispatch) => {
        return HttpApi.get('eFAQ_USER_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const getCtgryList = (params) => {
    return (dispatch) => {
        return HttpApi.get('eFAQ_CTGRY_USER_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
