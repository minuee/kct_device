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
        return HttpApi.get('eNOTICE_MATTER_USER_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const getDetail = (params) => {
    return (dispatch) => {
        return HttpApi.get('eNOTICE_MATTER_USER_DETAIL', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
