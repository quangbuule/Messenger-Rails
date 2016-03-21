import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import request from 'lib/request';
import { connect } from 'react-redux';

import AsyncAction from 'lib/AsyncAction';
import { getEntities, isLoading } from 'lib/store';

import UserListItem from './UserListItem';

class Explorer extends React.Component {

  static propTypes = {
    users: PropTypes.instanceOf(Immutable.List),
    loading: PropTypes.bool
  };

  render() {
    const { users, loading } = this.props;

    return (
      <div className="ExplorerPage">
        {users ?
          <div className="user-list">
            {users.map(user =>
              <div key={user.get('id')} className="user-wrapper">
                <UserListItem user={user} />
              </div>
            )}
          </div> :
          <div></div>
        }
      </div>
    );
  }

  componentDidMount() {
    this.props.loadUsers();
  }
}

export default connect(({ User }) => {
  const users = getEntities(User, 'collections:all');
  const isUsersLoading = isLoading(User, 'collections:all');

  return {
    users,
    isUsersLoading
  };
}, {
  loadUsers() {
    return new AsyncAction({
      type: '@@user/getAll',
      promise: request.get('/api/users').end()
    });
  }
})(Explorer);
