import React from 'react';

class PureAppComponent extends React.PureComponent {
  onMount() {
    this.mounted = true;
  }
  onUnmount() {
    this.mounted = false;
  }

  componentDidMount() {
    this.onMount();
  }
  componentWillUnmount() {
    this.onUnmount();
  }

  state = {};
  mounted = true;

  setAsyncState(x) {
    return new Promise((resolve) => {
      if (!this.mounted) return resolve(null);

      this.setState(x, () => resolve(x));
    });
  }
}

export default PureAppComponent;
