import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { getEntities, isLoading } from 'lib/store';

import AsyncAction from 'lib/AsyncAction';
import request from 'lib/request';

import Message from './Message';

class Conversation extends React.Component {

  static propTypes = {
    conversationId: PropTypes.number.isRequired,
    messages: PropTypes.instanceOf(Immutable.List),
    isLoading: PropTypes.bool
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };


  render() {
    const { messages } = this.props;

    return (
      <div className="Conversation">
        <div className="message-list-wrapper">
          {messages && messages.map(message =>
            <Message key={message.get('id')} message={message} />
          )}
        </div>
        <div className="input-wrapper">
          <div className="input-field">
            <input ref={c => c && c.focus()} placeholder="Input messages" onKeyDown={::this.handleInputKeyDown} />
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.fetchMessages();
    this._intervalId = window.setInterval(::this.fetchMessages, 2000);
  }

  componentWillUnmount() {
    window.clearInterval(this._intervalId);
  }

  fetchMessages() {
    const { conversationId } = this.props;

    this.context.store.dispatch(new AsyncAction({
      type: '@@message/getAll',
      promise: request.get(`/api/conversations/${conversationId}/messages`),
      messageCollectionId: `conversations:${conversationId}`,
      conversationId
    }));
  }

  sendMessage(content) {
    const { conversationId } = this.props;

    this.context.store.dispatch(new AsyncAction({
      type: '@@message/send',
      messageCollectionId: `conversations:${conversationId}`,
      content,
      promise: request.post(`/api/conversations/${conversationId}/messages`, {
        content
      })
    }));
  }

  handleInputKeyDown(e) {
    if (e.keyCode === 13) {
      const content = e.target.value;

      e.target.value = '';
      this.sendMessage(content);
    }
  }
}

export default connect(({ Message }, { conversationId }) => {
  const messages = getEntities(Message, `collections:conversations:${conversationId}`);
  const isMessagesLoading = isLoading(Message, `collections:conversations:${conversationId}`);

  return {
    messages,
    isMessagesLoading
  };
})(Conversation);
