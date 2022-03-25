/**
 * @providesModule ImageManager
 */

// API
import * as HttpApi from '../../api/index';
import {notifyMessage} from "../Utils";

export const uploadByImage = (params) => {
    console.log('uploadByImage :: UPLOAD :: ' + params);
    return (dispatch) => {
        return HttpApi.upload('eFILE_IMAGE_UPLOAD', params).then((response) => {
            console.log('uploadByImage :: UPLOAD :: ' + response);
            return Promise.resolve(response.data);
        }).catch((err) => {
            return HttpApi.upload('eFILE_IMAGE_UPLOAD', params).then((response) => {
                console.log('uploadByImage :: UPLOAD :: ' + response);
                return Promise.resolve(response.data);
            }).catch((err) => {
                notifyMessage("이미지 업로드에 실패하였습니다.\n다시 시도해주세요.");
                return Promise.reject(err);
            });
        });
    };
}

export const uploadByFile = (params) => {
    console.log('uploadByFile :: UPLOAD :: ' + params);
    return (dispatch) => {
        return HttpApi.upload('eFILE_UPLOAD', params).then((response) => {
            console.log('uploadByFile :: UPLOAD :: ' + response);
            return Promise.resolve(response.data);
        }).catch((err) => {
            return HttpApi.upload('eFILE_UPLOAD', params).then((response) => {
                console.log('uploadByFile :: UPLOAD :: ' + response);
                return Promise.resolve(response.data);
            }).catch((err) => {
                notifyMessage("파일 업로드에 실패하였습니다.\n다시 시도해주세요.");
                return Promise.reject(err);
            });
        });
    };
}
