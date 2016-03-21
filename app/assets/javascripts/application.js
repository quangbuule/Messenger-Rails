import React from 'react';
import ReactDOM from 'react-dom';
import ExplorerPage from './components/ExplorerPage';
import ConversationIndexPage from './components/ConversationIndexPage';
import { Provider } from 'react-redux';
import store from './lib/store';

function render(reactEl, el) {
  ReactDOM.render(<Provider store={store}>{reactEl}</Provider>, el);
}

window.renderExplorerPage = function (el) {
  render(<ExplorerPage />, el);
};

window.renderConversationIndexPage = function (el) {
  render(<ConversationIndexPage />, el);
}
