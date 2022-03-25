import { combineReducers } from 'redux';
import {eSESSION_reducer} from './eSESSION'
import {eCOMM_CD_reducer} from "./eCOMM_CD";

const AppReducer = combineReducers({
    eSESSION: eSESSION_reducer,
    eCOMM_CD: eCOMM_CD_reducer,
});

export default AppReducer;

