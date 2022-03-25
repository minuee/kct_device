import * as HttpApi from '../api/index';
import * as ActionTypes from '../actionTypes';

export const actionTypes = ActionTypes;


//////////////////
///// POST ///////
//////////////////
export const confirm = (params) => {
    return (dispatch) => {
        return HttpApi.post('eLAST_PURCHASE_USER_ORDER_CONFIRM', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const createExchng = (params) => {
    return (dispatch) => {
        return HttpApi.post('eLAST_PURCHASE_USER_ORDER_EXCHNG', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const createExchngCanc = (params) => {
    return (dispatch) => {
        return HttpApi.post('eLAST_PURCHASE_USER_ORDER_EXCHNG_CANCEL', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const createRefund = (params) => {
    return (dispatch) => {
        return HttpApi.post('eLAST_PURCHASE_USER_ORDER_RTNGUD', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const createRefundCanc = (params) => {
    return (dispatch) => {
        return HttpApi.post('eLAST_PURCHASE_USER_ORDER_RTNGUD_CANCEL', params)
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
