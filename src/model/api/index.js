import axios from 'axios';
import apiConfig, {apiUrl} from './config';
//utils
import {TOKEN} from "../lib/Utils/Strings";
import AsyncStorage from "@react-native-community/async-storage";
import {notifyMessage} from "../lib/Utils";

export const is_pg = true; // PG창 연결 여부
export const build_type = "dev_server" // production / development / dev_server
const API_URL = apiUrl[build_type];
const DELIVERY_URL = apiUrl['deliverytrack'];

export const getMallID = () => {
    const test_pg = "T0010996";
    const release_pg = "05558967"
    return release_pg;
}
export const getPGUrl = () => {
    const test_pg = "https://testpgapi.easypay.co.kr/api/trades/webpay";
    const release_pg = "https://pgapi.easypay.co.kr/api/trades/webpay"
    return release_pg;
}
export const getPGCallbackUrl = () => {
    const test_pg = "http://dev.tplusshop.com/kicc";
    const release_pg = "https://api.tplusshop.com/kicc"
    return build_type === "production" ? release_pg : test_pg;
}

const checkAccessToken = async () => {
    // 토큰 구분은 나중에
    let token;
    await AsyncStorage.getItem(TOKEN.user).then((value) =>
        token = value
    );

    if (token) {
        return token;
    } else {
        console.log('/Lib/Api/index.js :: checkAccessToken :: Failed!');
    }
};

export const get = (path, parameters = {}) => {
    console.log(':: GET :: ' + API_URL + apiConfig[path]);
    parameters.updateCallback = new Date();
    return axios.get(API_URL + apiConfig[path], {params: parameters}, apiConfig,
        {headers: {'Authorization': 'Bearer ' + checkAccessToken()}})
        .then((response) => {
            console.log(':: GET :: ' + path + ' :: Success!');
            return Promise.resolve(response);
        })
        .catch((err) => {
            if (err && err.response && err.response.data && err.response.data.msg) {
                notifyMessage(err.response.data.msg);
            }
            console.log(':: GET :: ' + path + ' :: Failed!');
            return Promise.reject(err);
        });
};
export const post = (path, parameters = {}) => {
    console.log(':: POST :: ' + API_URL + apiConfig[path]);
    parameters.updateCallback = new Date();
    return axios.post(API_URL + apiConfig[path], parameters,
        {headers: {'Authorization': 'Bearer ' + checkAccessToken()}})
        .then((response) => {
            console.log(':: POST :: ' + path + ' :: Success!');
            return Promise.resolve(response);
        })
        .catch((err) => {
            if (apiConfig[path] !== "/eMBER_LOGIN_SOCIAL" && err && err.response && err.response.data && err.response.data.msg) {
                notifyMessage(err.response.data.msg);
            }
            console.log(':: POST :: ' + path + ' :: Failed!');
            return Promise.reject(err);
        });
};

export const upload = (path, parameters = {}) => {
    console.log(':: UPLOAD :: ' + apiConfig[path]);
    parameters.updateCallback = new Date();
    let body = new FormData();
    body.append('file', parameters);

    return axios.post(API_URL + apiConfig[path], body,
        {
            headers: {
                'Accept': 'multipart/form-data',
                'Content-Type': 'multipart/form-data',
            }
        })
        .then((response) => {
            console.log('/Lib/Api/index.js :: UPLOAD :: ' + path + ' :: Success!');
            return Promise.resolve(response);
        })
        .catch((err) => {
            console.log('/Lib/Api/index.js :: UPLOAD :: ' + path + ' :: Failed!');
            console.log(err);
            return Promise.reject(err);
        });
}

export const deliveryTrack = (parameters = {}) => {
    console.log(':: deliveryTrack :: ');
    // parameters.updateCallback = new Date();

    let TRACK_URL = DELIVERY_URL
    if(parameters.carrier_id && parameters.track_id)
        TRACK_URL += '/' +  parameters.carrier_id + '/tracks/' + parameters.track_id
    console.log('TRACK_URL')
    console.log(TRACK_URL)
    return axios.get(TRACK_URL)
        .then((response) => {
            console.log('/Lib/Api/index.js :: deliveryTrack :: Success!');
            return Promise.resolve(response);
        })
        .catch((err) => {
            console.log('/Lib/Api/index.js :: deliveryTrack :: Failed!');
            console.log(err);
            return Promise.reject(err);
        });
}

export const postPay = (path, parameters = {}) => {
    console.log(':: POST PAY :: ');
    console.log("parameters")
    console.log(parameters)

    return axios.post(path, parameters, {
        headers: {
            'Content-Type': 'application/json',
            'Charset': 'utf-8',
        }
    })
        .then((response) => {
            console.log('/Lib/Api/index.js :: POST PAY :: Success!');
            return Promise.resolve(response);
        })
        .catch((err) => {
            console.log('/Lib/Api/index.js :: POST PAY :: Failed!');
            console.log(err);
            return Promise.reject(err);
        });
};
