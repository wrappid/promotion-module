import { RESET_TEST } from "../types/test.types";

const initialState = {
  error  : false,
  message: "This is a test module.",
  success: false
};

const testReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_TEST:
      return initialState;

    default:
      return state;
  }
};

export default testReducer;