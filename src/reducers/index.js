import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

const HandleFileReducer = (state = [], action) => {
  switch (action.type) {
    case "SELECT_FILES":
      return action.filesList;
    case "REMOVE_FILE":
      action.inputRef.removeFile(action.file);
      return state.filter(file => !Object.is(file, action.file));
    default:
      return state;
  }
};

const SetRefReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_REF":
      return action.ref;
    default:
      return state;
  }
};

const FetchRoundsReducer = (state = [], action) => {
  switch (action.type) {
    case "FETCH_ROUNDS":
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  selectedFiles: HandleFileReducer,
  inputRef: SetRefReducer,
  roundsList: FetchRoundsReducer,
  form: formReducer
  
});
