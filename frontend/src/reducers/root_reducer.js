import { combineReducers } from "redux";
import sessionReducer from "./session_reducer";
import campaignReducer from "./campaign_reducer";
import errorsReducer from "./errors_reducer";
import usersReducer from "./user_reducer";
import messagesReducer from "./message_reducer";
import charactersReducer from "./character_reducer";

const rootReducer = combineReducers({
  session: sessionReducer,
  campaigns: campaignReducer,
  errors: errorsReducer,
  users: usersReducer,
  messages: messagesReducer,
  characters: charactersReducer
});

export default rootReducer;