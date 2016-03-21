import React, { PropTypes } from 'react';
import Immutable from 'immutable';

export default class Message extends React.Component {

  static propTypes = {
    message: PropTypes.instanceOf(Immutable.Map)
  };

  render() {
    const { message } = this.props;
    const className = 'Message' + (
      message.getIn([ 'user', 'id' ]) === window.currentUser.id ?
        ' current' :
        ''
    );

    return (
      <div className={className}>
        <div className="container-1">
          <div className="avatar-wrapper">
            <div className="avatar">
              {message.getIn([ 'user', 'username' ]).substr(0, 1)}
            </div>
          </div>
          <div className="content-wrapper">
            <div className="username">
              {message.getIn([ 'user', 'username' ])}
            </div>
            <div className="content">
              {message.get('content')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
