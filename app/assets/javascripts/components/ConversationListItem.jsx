import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import moment from 'moment';

export default class ConversationListItem extends React.Component {

  static propTypes = {
    conversation: PropTypes.instanceOf(Immutable.Map).isRequired,
    onSelect: PropTypes.func.isRequired
  }

  render() {
    const { conversation } = this.props;
    const lastMessage = conversation.get('last_message');
    const subscription = conversation.get('subscriptions').find(s => s.get('user_id') === window.currentUser.id);

    return (
      <div
        className={'ConversationListItem ' + (subscription.get('read') ? '' : ' unread')}
        onClick={() => this.props.onSelect({ conversation })}
      >
        {lastMessage ?
          <div className="conversation">
            <div className="avatar-wrapper">
              <div className="avatar">
                {lastMessage.getIn([ 'user', 'username' ]).substr(0, 1)}
              </div>
            </div>
            <div className="right-col">
              <div className="header">
                <div className="username">
                  {lastMessage.getIn([ 'user', 'username' ])}
                </div>
                <div className="dateline">
                  {moment(lastMessage.get('created_at')).fromNow()}
                </div>
              </div>
              <div className="content">
                {lastMessage.get('content')}
              </div>
            </div>
          </div> :
          <div className="new">New conversation</div>
        }
      </div>
    );
  }
}
