import jsonPlaceHolder from "../apis/jsonPlaceHolder";

// export const fetchPosts = async () => {
//   return async (dispatch) => {
//     const response = await jsonPlaceHolder.get("/posts");
//     dispatch({
//       type: "Fetch_POSTS",
//       payload: response.data,
//     });
//   };
// };

export const fetchPosts = () => async (dispatch) => {
  const response = await jsonPlaceHolder.get("/posts");

  dispatch({ type: "FETCH_POSTS", payload: response.data });
};

export const fetchUsers = (id) => async (dispatch) => {
  const response = await jsonPlaceHolder.get(`/users/${id}`);
  dispatch({ type: "FETCH_USER", payload: response.data });
};
