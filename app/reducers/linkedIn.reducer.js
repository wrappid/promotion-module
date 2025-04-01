import { POST_FAILURE, POST_SUCCESS } from "../types/test.types";

const initialState = {
  data   : {},
  error  : false,
  success: false,
};

const linkedinReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_SUCCESS:
      return {
        ...state,
        data   : action.payload,
        error  : false,
        success: true
      };

    case POST_FAILURE:
      return {
        ...state,
        error  : true,
        success: false
      };

    default:
      return state;
  }
};

export default linkedinReducer;