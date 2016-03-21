export const States = {
  init: 'init',
  success: 'success',
  failure: 'failure'
};

export default class AsyncAction {
  static States = States

  constructor(props) {
    Object.keys(props).forEach(key => {
      this[key] = props[key];
    });
  }
}
