import React from 'react';
import { DataConsumer } from '../../context/data';
import { Header } from 'semantic-ui-react';

// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction
// https://react.semantic-ui.com/collections/grid/

export default class FavColor extends React.Component {
  render() {
    return (
      <DataConsumer>
        {({ userSettings }) => {
          const favColor = (userSettings && userSettings.favoriteColor) || '';
          return (
            <div
              style={{
                width: '100%',
                height: '100%',
                color: favColor,
                backgroundColor: favColor
              }}
            >
              <div className="outline-text">
                <Header as="h2">Fav Color: {favColor}</Header>
              </div>
            </div>
          );
        }}
      </DataConsumer>
    );
  }
}
