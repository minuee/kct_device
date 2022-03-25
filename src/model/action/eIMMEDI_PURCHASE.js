import * as HttpApi from '../api/index';
import * as ActionTypes from '../actionTypes';

export const actionTypes = ActionTypes;


//////////////////
///// POST ///////
//////////////////
export const create = (params) => {
    return (dispatch) => {
        return HttpApi.post('eIMMEDI_PURCHASE_USER_CREATE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const createDetail = (params) => {
    return (dispatch) => {
        return HttpApi.post('eIMMEDI_PURCHASE_DTL_USER_CREATE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const createOptn = (params) => {
    return (dispatch) => {
        return HttpApi.post('eIMMEDI_PURCHASE_DTL_ADD_OPTN_USER_CREATE', params)
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
        return HttpApi.post('eIMMEDI_PURCHASE_USER_DELETE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const canc = (params) => {
    return (dispatch) => {
        return HttpApi.post('eIMMEDI_PURCHASE_USER_ORDER_CANC', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const confirm = (params) => {
    return (dispatch) => {
        return HttpApi.post('eIMMEDI_PURCHASE_DTL_USER_ORDER_CONFIRM', params)
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
        return HttpApi.post('eIMMEDI_PURCHASE_DTL_USER_ORDER_RTNGUD', params)
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
        return HttpApi.post('eIMMEDI_PURCHASE_DTL_USER_ORDER_RTNGUD_CANCEL', params)
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
        return HttpApi.post('eIMMEDI_PURCHASE_DTL_USER_ORDER_EXCHNG', params)
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
        return HttpApi.post('eIMMEDI_PURCHASE_DTL_USER_ORDER_EXCHNG_CANCEL', params)
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
        return HttpApi.get('eIMMEDI_PURCHASE_USER_DETAIL', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
