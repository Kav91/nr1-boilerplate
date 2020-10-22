// https://reactjs.org/docs/context.html
// Context provides a way to pass data through the component tree without having to pass props down manually at every level.

import React, { Component } from 'react';
import { NerdGraphQuery } from 'nr1';
import { accountsQuery } from './queries';
import { getUserCollection } from './utils';

const DataContext = React.createContext();

// A React component that allows Consumers to subscribe to context changes
// It accepts a value to be passed on to Consumers that are descendants of this Provider.

export class DataProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userSettings: {},
      accounts: [],
      accountSelection: null,
      hasError: false,
      err: null,
      errInfo: null,
      entitySearchCount: 0
    };
  }

  // When your application starts if it depends on data immediately add this here
  async componentDidMount() {
    const accounts = await this.getAccounts();
    const userSettings = await this.getUserSettings();
    this.setState({ accounts, userSettings });
  }

  // https://reactjs.org/docs/react-component.html#componentdidcatch
  componentDidCatch(err, errInfo) {
    this.setState({ hasError: true, err, errInfo });
  }

  // Fetch account data with additional information (reportingEventTypes)
  getAccounts = () => {
    return new Promise(resolve => {
      // https://developer.newrelic.com/components/nerd-graph-query
      NerdGraphQuery.query({
        query: accountsQuery
      }).then(nerdGraphData => {
        const result = nerdGraphData.data;
        const accounts = result.actor.accounts || [];
        resolve(accounts);
      });
    });
  };

  // Fetch user settings from nerd storage
  getUserSettings = async () => {
    // multiple documents can be returned from getUserCollection when no documentId is provided (second parameter)
    const userSettings = await getUserCollection('UserSettings', 'main');
    return userSettings || {};
  };

  // this function will be passed through to allow other components to write into its state
  updateDataStateContext = stateData => {
    this.setState(stateData);
  };

  render() {
    const { children } = this.props;

    // all state will become available, as well as any added functions to the children
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    return (
      <DataContext.Provider
        value={{
          ...this.state,
          updateDataStateContext: this.updateDataStateContext
        }}
      >
        {children}
      </DataContext.Provider>
    );
  }
}

export const DataConsumer = DataContext.Consumer;
