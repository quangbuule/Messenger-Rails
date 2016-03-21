import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { getEntities, isLoading } from 'lib/store';

import AsyncAction from 'lib/AsyncAction';
import request from 'lib/request';

import  ConversationListitem from './ConversationListitem';
import  ConversationCreatePanel from './ConversationCreatePanel';
import  Conversation from './Conversation';

class ConversationIndexPage extends React.Component {

  constructor() {
    super(...arguments);
    this.createConversation = ::this.createConversation;
  }

  static propTypes = {
    conversations: PropTypes.instanceOf(Immutable.List),
    isConversationsLoading: PropTypes.bool
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  state = {
    creating: false,
    conversationId: null
  };

  render() {
    const { conversations } = this.props;
    const { creating, conversationId } = this.state;

    return (
      <div className="ConversationIndexPage">
        <div className="conversation-list-wrapper">
          {conversations && conversations.map(c =>
            <ConversationListitem
              key={c.get('id')}
              conversation={c}
              onSelect={::this.handleConversationSelect}
            />
          )}
          <a className="btn-floating btn-large waves-effect waves-light red" onClick={this.createConversation}>
            <i className="fa fa-plus" />
          </a>
        </div>
        {creating &&
          <div className="creating">
            <ConversationCreatePanel onCreate={::this.handleConversationCreate} />
          </div>
        }
        {conversationId &&
          <div className="conversation-wrapper">
            <Conversation key={conversationId} conversationId={conversationId} />
          </div>
        }
      </div>
    );
  }

  componentDidMount() {
    this.fetchConversations();
    this._intervalId = window.setInterval(::this.fetchConversations, 2000);
  }

  componentWillUnmount() {
    window.clearInterval(this._intervalId);
  }


  fetchConversations() {
    this.context.store.dispatch(new AsyncAction({
      type: '@@conversation/getAll',
      promise: request.get('/api/conversations')
    }));
  }

  handleConversationSelect({ conversation }) {
    this.setState({
      creating: false,
      conversationId: conversation.get('id')
    });
  }

  createConversation() {
    this.setState({
      creating: true,
      conversationId: null
    });
    // this.context.store.dispatch( new AsyncAction({
    //   type: '@conversation/create',
    //   promise: request.post('/conversations')
    // }));
  }

  handleConversationCreate({ conversationId }) {
    this.setState({
      creating: false,
      conversationId
    });
  }
}

export default connect(({ Conversation }) => {
  const conversations = getEntities(Conversation, 'collections:all');
  const isConversationsLoading = isLoading(Conversation, 'collections:all');

  return {
    conversations,
    isConversationsLoading
  };
})(ConversationIndexPage);
