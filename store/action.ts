export const SET_USER = "SET_USER";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const SET_TOKEN = "SET_TOKEN";
export const SET_BALANCE = "SET_BALANCE";

export const setUser = (user: any) => ({
  type: SET_USER,
  payload: user,
});

export const login = () => ({
  type: LOGIN,
});

export const logout = () => ({
  type: LOGOUT,
});

export const setToken = (token: string) => ({
  type: SET_TOKEN,
  payload: token,
});

export const setBalance = (balance: number) => ({
  type: SET_BALANCE,
  payload: balance,
});
