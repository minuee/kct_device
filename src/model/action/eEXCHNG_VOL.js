import * as HttpApi from '../api/index';
import * as ActionTypes from '../actionTypes';

export const actionTypes = ActionTypes;


//////////////////
///// POST ///////
//////////////////
export const create = (params) => {
    return (dispatch) => {
        return HttpApi.post('eEXCHNG_VOL_TRD_USER_CREATE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const update = (params) => {
    return (dispatch) => {
        return HttpApi.post('eEXCHNG_VOL_TRD_USER_UPDATE', params)
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
        return HttpApi.post('eEXCHNG_VOL_TRD_USER_DELETE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const createAuc = (params) => {
    return (dispatch) => {
        return HttpApi.post('eEXCHNG_VOL_AUC_TRD_USER_CREATE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const abandAuc = (params) => {
    return (dispatch) => {
        return HttpApi.post('eEXCHNG_VOL_AUC_TRD_USER_BID_ABAND', params)
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
        return HttpApi.get('eEXCHNG_VOL_USER_LIST', params)
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
        return HttpApi.get('eEXCHNG_VOL_TRD_USER_DETAIL', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const getAucDetail = (params) => {
    return (dispatch) => {
        return HttpApi.get('eEXCHNG_VOL_AUC_TRD_USER_DETAIL', params)
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
        return HttpApi.get('eEXCHNG_VOL_TRD_USER_STORE_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const getUse = (params) => {
    return (dispatch) => {
        return HttpApi.get('eEXCHNG_VOL_USER_STORE_USE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const getShare = (params) => {
    return (dispatch) => {
        return HttpApi.get('eEXCHNG_VOL_TRD_USER_SHARE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const getTrdList = (params) => {
    return (dispatch) => {
        return HttpApi.get('eEXCHNG_VOL_TRD_USER_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const getAucList = (params) => {
    return (dispatch) => {
        return HttpApi.get('eEXCHNG_VOL_AUC_TRD_USER_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const getCount = (params) => {
    return (dispatch) => {
        return HttpApi.get('eEXCHNG_VOL_TRD_USER_ORDER_COUNT', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const getOrderList = (params) => {
    return (dispatch) => {
        return HttpApi.get('eEXCHNG_VOL_TRD_USER_ORDER_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
