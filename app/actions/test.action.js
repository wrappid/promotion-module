import { RESET_TEST, POST_FAILURE, POST_SUCCESS } from "../types/test.types";

export const testSuccess = () => {
  return (dispatch) => {
    dispatch({ type: POST_SUCCESS });
  };
};

export const testFailure = () => {
  return (dispatch) => {
    dispatch({ type: POST_FAILURE });
  };
};

export const resetTest = () => {
  return (dispatch) => {
    dispatch({ type: RESET_TEST });
  };
};