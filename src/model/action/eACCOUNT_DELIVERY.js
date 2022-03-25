import * as HttpApi from '../api/index';
import * as ActionTypes from '../actionTypes';

export const actionTypes = ActionTypes;


//////////////////
///// POST ///////
//////////////////
export const createDelivery = (params) => {
    return (dispatch) => {
        return HttpApi.post('eACCOUNT_DELIVERY_USER_CREATE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const updateDelivery = (params) => {
    return (dispatch) => {
        return HttpApi.post('eACCOUNT_DELIVERY_USER_UPDATE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
}

export const removeDelivery = (params) => {
    return (dispatch) => {
        return HttpApi.post('eACCOUNT_DELIVERY_USER_DELETE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const createOrderDlvy = (params) => {
    return (dispatch) => {
        return HttpApi.post('eDLVY_USER_REFRESH', params)
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
export const getDeliveryList = (params) => {
    return (dispatch) => {
        return HttpApi.get('eACCOUNT_DELIVERY_USER_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const getDeliveryDetail = (params) => {
    return (dispatch) => {
        return HttpApi.get('eACCOUNT_DELIVERY_USER_DETAIL', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
