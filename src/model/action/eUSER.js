import * as HttpApi from '../api/index';
import * as ActionTypes from '../actionTypes';

export const actionTypes = ActionTypes;


//////////////////
///// POST ///////
//////////////////
export const login = (params) => {
    return (dispatch) => {
        return HttpApi.post('eUSER_LOGIN', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const logout = (params) => {
    return (dispatch) => {
        return HttpApi.post('eUSER_LOGOUT', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
}

export const sendAuthMessage = (params) => {
    return (dispatch) => {
        return HttpApi.post('eVERFI_SMS_CREATE', params)
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
export const checkAuthNumber = (params) => {
    return (dispatch) => {
        return HttpApi.get('eVERFI_SMS_CHECK', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
