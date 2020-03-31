// import axios from "axios";
import {
  SIGN_UP_ACTION,
  LOG_IN_ACTION,
  SIGN_UP_CHECK,
  USER_INFO_REFRESH,
  LOG_OUT_ACTION,
  GET_POST_DATA
} from "./actions";

const initialState = {
  userInfo: {},
  post: [],
  signupCheck: false,
  loginCheck: true
};

// const callAxios = async (type, address, payload) => {
//   const result = axios({
//     method: type,
//     url: `http://localhost:8080${address}`,
//     params: {
//       ...payload
//     },
//     credentials: "include",
//     withCredentials: true
//   });
//   info = await result;
//   console.log(info);
//   return result;
// };

const reducer = (state = initialState, action) => {
  // console.log("action", action);
  switch (action.type) {
    case SIGN_UP_ACTION: {
      // callAxios("post", "/user/signup", action.payload);
      return {
        ...state
      };
    }
    case SIGN_UP_CHECK: {
      return {
        ...state,
        signupCheck: action.payload === undefined ? true : false,
        userInfo: action.payload
      };
    }
    case LOG_IN_ACTION: {
      // callAxios("post", "/user/signin", action.payload);
      return {
        ...state,
        userInfo: action.payload
      };
    }
    case LOG_OUT_ACTION: {
      return {
        ...state,
        userInfo: {}
      };
    }
    case USER_INFO_REFRESH: {
      return {
        ...state,
        userInfo: action.payload
      };
    }
    case GET_POST_DATA: {
      console.log("check action ", action.payload.length);
      return {
        ...state,
        post: action.payload
      };
    }

    default: {
      return {
        ...state
      };
    }
  }
};

export default reducer;