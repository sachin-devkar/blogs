export default (state = [], actions) => {
  switch (actions.type) {
    case "FETCH_USER":
      return [...state, actions.payload];

    default:
      return state;
  }
};
