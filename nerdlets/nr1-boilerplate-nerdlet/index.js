import React from 'react';
import { DataProvider } from './context/data';
import MenuBar from './components/navigation/menu-bar';
import Grid from './components/grid';
import { AutoSizer } from 'nr1';

// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction
// https://react.semantic-ui.com/collections/grid/

export default class Nr1BoilerplateNerdlet extends React.Component {
  render() {
    return (
      <DataProvider>
        <AutoSizer>
          {({ width, height }) => (
            <div style={{ width, height, overflowX: 'hidden' }}>
              <MenuBar />
              <Grid width={width} height={height} />
            </div>
          )}
        </AutoSizer>
      </DataProvider>
    );
  }
}
