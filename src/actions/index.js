import tnpbase from "../api/tnpbase";

export const SelectFiles = files => {
  return {
    type: "SELECT_FILES",
    filesList: files
  };
};

export const RemoveFile = (file, inputRef) => {
  return {
    type: "REMOVE_FILE",
    file: file,
    inputRef: inputRef
  };
};

export const SetRef = ref => {
  return {
    type: "SET_REF",
    ref: ref
  };
};

export const FetchRounds = () => async dispatch => {
  const response = await tnpbase.get("/rounds");
  dispatch({ type: "FETCH_ROUNDS", payload: response.data });
};
