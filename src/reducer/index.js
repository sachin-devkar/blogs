import { combineReducers } from "redux";
import postReducer from "./postReducer";
import usersReducer from "./userReducer";

const songsReducer = () => {
  return [
    { title: "song1", duration: "4.30" },
    { title: "song3", duration: "3.30" },
    { title: "song4", duration: "5.30" },
    { title: "song5", duration: "8.30" },
  ];
};

const selectedSongReducer = (selectedSong = null, action) => {
  if (action.type === "SONG_SELECTED") {
    return action.payload;
  }
  return null;
};

export default combineReducers({
  posts: postReducer,
  user: usersReducer,
});
