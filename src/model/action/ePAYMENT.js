import * as HttpApi from '../api/index';
import * as ActionTypes from '../actionTypes';

export const actionTypes = ActionTypes;


//////////////////
///// POST ///////
//////////////////
export const createPayView = (link, params) => {
    return (dispatch) => {
        return HttpApi.postPay(link, params)
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
        return HttpApi.post('ePAYMENT_USER_TEMP_AUC_DPST_SUCCESS', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const createAucPoint = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_AUC_DPST_POINT', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const createAucRemain = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_TEMP_AUC_REMAIN_SUCCESS', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const createAucRemainTransfer = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_AUC_REMAIN_TRANSFER', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const createAucRemainPoint = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_AUC_REMAIN_POINT', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const createCoper = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_TEMP_COPERTN_PURCHASE_SUCCESS', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const createCoperPoint = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_COPERTN_PURCHASE_POINT', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const createImmedi = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_TEMP_IMMEDI_SUCCESS', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const createImmediPoint = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_IMMEDI_PURCHASE_POINT', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const createImmediTransfer = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_IMMEDI_PURCHASE_TRANSFER', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const createReservPoint = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_RESERV_DPST_POINT', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const createReservRemainPoint = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_RESERV_REMAIN_POINT', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const createReservRemainTransfer = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_RESERV_REMAIN_TRANSFER', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const availableAucDpst = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_AUC_DPST_AVAILABLE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const availableAucRemain = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_AUC_REMAIN_AVAILABLE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const availableReservDpst = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_RESERV_DPST_AVAILABLE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const availableReservRemain = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_RESERV_REMAIN_AVAILABLE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const availableCoper = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_COPERTN_PURCHASE_AVAILABLE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const availableImmedi = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_IMMEDI_PURCHASE_AVAILABLE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const createImmediExchngPoint = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_EXCHNG_VOL_IMMEDI_POINT', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const availableImmediExchng = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_EXCHNG_VOL_IMMEDI_AVAILABLE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const createAucExchngPoint = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_EXCHNG_VOL_AUC_TRD_POINT', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
export const availableAucExchng = (params) => {
    return (dispatch) => {
        return HttpApi.post('ePAYMENT_USER_EXCHNG_VOL_AUC_TRD_AVAILABLE', params)
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
