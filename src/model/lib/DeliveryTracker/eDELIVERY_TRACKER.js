import * as HttpApi from '../../api/index';
import * as ActionTypes from '../../actionTypes';

export const actionTypes = ActionTypes;
/*
* let params = {
*   carrier_id: "",
*   track_id: "",
* };
*/

export const getDeliveryTrack = (params) => {
    console.log('deliveryTrack :: deliveryTrack :: ' + params);
    return (dispatch) => {
        return HttpApi.deliveryTrack(params).then((response) => {
            console.log('deliveryTrack :: deliveryTrack :: ' + response);
            return Promise.resolve(response.data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    };
}
