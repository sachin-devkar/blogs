import React from "react";
import { connect } from "react-redux";
import { fetchUsers } from "../actions";

class UserHeader extends React.Component {
  componentDidMount() {
    this.props.fetchUsers(this.props.userId);
  }
  render() {
    const { user } = this.props;
    if (!user) {
      return null;
    }

    return <div className="header">{user.name}</div>;
  }
}
const mapStateToprops = (state, ownProps) => {
  return {
    user: state.user.find((user) => user.id === ownProps.userId),
  };
};
export default connect(mapStateToprops, { fetchUsers })(UserHeader);
//export default UserHeader;
