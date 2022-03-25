import * as HttpApi from '../api/index';
import * as ActionTypes from '../actionTypes';

export const actionTypes = ActionTypes;

//////////////////
///// GET ///////
//////////////////
export const getConst = (params) => {
    return (dispatch) => {
        return HttpApi.get('eCOMM_CD', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const setConst = (eCOMM_CD) => {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.eCOMM_CD,
            eCOMM_CD: eCOMM_CD,
        });
    };
};


export const setConstType = (eCOMM_CD) => {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.eCOMM_CD_TYPE,
            eCOMM_CD_TYPE: eCOMM_CD,
        });
    };
};

export const getAppVer = (params) => {
    return (dispatch) => {
        return HttpApi.get('eAPP_VER', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

export const getHdlvy = (params) => {
    return (dispatch) => {
        return HttpApi.get('eHDLVY_CMPNY', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
