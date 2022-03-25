import * as HttpApi from '../api/index';
import * as ActionTypes from '../actionTypes';

export const actionTypes = ActionTypes;


//////////////////
///// POST ///////
//////////////////
export const login = (params) => {
    return (dispatch) => {
        return HttpApi.post('eMBER_LOGIN', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const loginSocial = (params) => {
    return (dispatch) => {
        return HttpApi.post('eMBER_LOGIN_SOCIAL', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const create = (params) => {
    return (dispatch) => {
        return HttpApi.post('eMBER_USER_CREATE', params)
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
        return HttpApi.post('eMBER_USER_UPDATE', params)
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
        return HttpApi.post('eMBER_USER_DELETE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const createImg = (params) => {
    return (dispatch) => {
        return HttpApi.post('eMBER_IMG_USER_CREATE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const updateImg = (params) => {
    return (dispatch) => {
        return HttpApi.post('eMBER_IMG_USER_UPDATE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const createConn = (params) => {
    return (dispatch) => {
        return HttpApi.post('eMBER_CONN_USER_CREATE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const updateConn = (params) => {
    return (dispatch) => {
        return HttpApi.post('eMBER_CONN_USER_UPDATE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const findId = (params) => {
    return (dispatch) => {
        return HttpApi.post('eMBER_FIND_ID', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const findPwdGeneral = (params) => {
    return (dispatch) => {
        return HttpApi.post('eMBER_FIND_PASSWORD_MSC00001', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const findPwdCompany = (params) => {
    return (dispatch) => {
        return HttpApi.post('eMBER_FIND_PASSWORD_MSC00002', params)
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
        return HttpApi.get('eMBER_DETAIL', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const checkEmail = (params) => {
    return (dispatch) => {
        return HttpApi.get('eMBER_CHECK_EMAIL', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const checkMobile = (params) => {
    return (dispatch) => {
        return HttpApi.get('eMBER_CHECK_MOBLPHON', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const checkAleady = (params) => {
    return (dispatch) => {
        return HttpApi.get('eMBER_CHECK_ALEADY_EXIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

