import { combineReducers } from "redux";
import { LOGIN, LOGOUT, SET_BALANCE, SET_TOKEN, SET_USER } from "./action";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  user: null,
};

const initialTokenState = {
  token: null,
};

const initialStateAuth = {
  isAuthenticated: false,
};

const initialBalanceState = {
  balance: 0,
};

const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };

    case LOGOUT:
      return { ...state, user: null };
      
    default:
      return state;
  }
};

const authReducer = (state = initialStateAuth, action: any) => {
  switch (action.type) {
    case LOGOUT:
      return { ...state, isAuthenticated: false };
    case LOGIN:
      return { ...state, isAuthenticated: true };
    default:
      return state;
  }
};

const tokenReducer = (state = initialTokenState, action: any) => {
  switch (action.type) {
    case SET_TOKEN:
      return { ...state, token: action.payload };
    default:
      return state;
  }
};

const balanceReducer = (state = initialBalanceState, action: any) => {
  switch (action.type) {
    case SET_BALANCE:
      return { ...state, balance: action.payload };
    default:
      return state;
  }
};
const appReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  token: tokenReducer,
  balance: balanceReducer,
});

export default appReducer;
