import { connect } from 'react-redux';
import DashboardApp from '../pages/DashboardApp';
import * as types from '../actions/todoActions';

const showLoginUsername = (username, filter) => {
  switch (filter) {
    case types.showLoginUsername:
      return username;

    default:
      return 0;
  }
};

const mapStateToProps = (state) => ({
  username: showLoginUsername(state.username, state.showLoginUsername)
});

export default connect(mapStateToProps)(DashboardApp);
