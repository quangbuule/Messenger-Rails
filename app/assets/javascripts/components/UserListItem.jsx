import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import request from 'lib/request';

export default class UserListItem extends React.Component {

  constructor() {
    super(...arguments);

    this.addFriend = ::this.addFriend;
  }

  static propTypes = {
    user: PropTypes.instanceOf(Immutable.Map)
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const { user } = this.props;

    return (
      <div className="UserListItem">
        <div className="card">
          <div className="card-content">
            <div className="avatar">
              {user.get('username').substr(0, 1)}
            </div>
            <div className="username">
              {user.get('username')}
            </div>
          </div>
          <div className="card-action">
            {user.get('is_friend') ?
              <a href="#">
                <i className="fa fa-check" />
                {' '} Friend
              </a> :
              <a href="#" onClick={this.addFriend}>
                Add friend
              </a>
            }
          </div>
        </div>
      </div>
    );
  }

  addFriend() {
    const userId = this.props.user.get('id');

    this.context.store.dispatch({
      type: '@@user/addFriend',
      userId,
      promise: request.post('/api/friends', { friend: { id: userId } }).end()
    });
  }
}
