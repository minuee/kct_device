import * as HttpApi from '../api/index';
import * as ActionTypes from '../actionTypes';

export const actionTypes = ActionTypes;


//////////////////
///// POST ///////
//////////////////

//////////////////
///// GET ///////
//////////////////
export const getDetail = (params) => {
    return (dispatch) => {
        return HttpApi.get('eUSE_STPLAT_USER_DETAIL', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
