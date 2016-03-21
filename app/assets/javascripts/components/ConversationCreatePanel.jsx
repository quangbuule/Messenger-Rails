import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import throttle from 'lodash.throttle';
import request from 'lib/request';

export default class ConversationCreatePanel extends React.Component {

  constructor() {
    super(...arguments);

    this.handleUserQueryChange = throttle(::this.handleUserQueryChange, 300, { trailing: true });
    this.__lqid = null;
  }

  static propTypes = {
    onCreate: PropTypes.func
  };

  state = {
    receipents: new Immutable.List,
    users: new Immutable.List,
    creating: false
  };

  render() {
    const { receipents, users, creating } = this.state;

    return (
      <div
        className="ConversationCreatePanel"
        style={creating ? { opacity: 0.5, pointerEvents: 'none' } : {}}
      >
        {receipents.size > 0 &&
          <div className="chip-container">
            {receipents.map(r =>
              <div key={r.get('id')} className="chip" onClick={() => this.removeReceipent(r)}>
                {r.get('username')}
                {' '}<i className="fa fa-remove" />
              </div>
            )}
          </div>
        }
        <div className="search-box">
          <div className="input-field">
            <input
              ref={c => c && c.focus()}
              type="text"
              placeholder="receipents"
              onChange={this.handleUserQueryChange}
            />
          </div>
        </div>
        <div className="found-user-list">
          {users.map(user =>
            <div key={user.get('id')} className="user" onClick={() => this.addReceipent(user)}>
              <div className="avatar">
                {user.get('username').substr(0, 1)}
              </div>
              <div className="username">
                {user.get('username')}
              </div>
            </div>
          )}
        </div>
        {receipents.size > 0 &&
          <div className="actions">
            <div className="inner">
              <a className="waves-effect waves-light btn" onClick={::this.createConversation}>
                Send message
              </a>
            </div>
          </div>
        }
      </div>
    );
  }

  handleUserQueryChange(e) {
    const __lqid = Math.random().toString(36).substr(2);
    this.__lqid = __lqid;
    const query = e.target && e.target.value || '';

    request.get('/api/users', { q: query })
      .end()
      .then((response) => {
        if (__lqid === this.__lqid) {
          this.setState({
            users: Immutable.fromJS(response.body)
          });
        }
      });
  }

  addReceipent(user) {
    const { receipents } = this.state;
    if (receipents.find(r => r.get('id') === user.get('id'))) {
      return;
    }

    this.setState({
      receipents: receipents.push(user)
    });
  }

  removeReceipent(receipent) {
    const { receipents } = this.state;

    this.setState({
      receipents: receipents.filterNot(r => r === receipent)
    });
  }

  createConversation() {
    const { receipents } = this.state;
    this.setState({ creating: true });

    request.post('/api/conversations', {
      receipent_ids: receipents.map(r => r.get('id')).toJSON()
    })
      .end()
      .then((response) => {
        const conversationId = response.body.id;
        this.props.onCreate({ conversationId });
      });
  }
}
