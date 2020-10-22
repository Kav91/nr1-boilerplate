import React from 'react';
import { DataConsumer } from '../../context/data';
import { Header } from 'semantic-ui-react';
import { LineChart } from 'nr1';
// https://developer.newrelic.com/components/line-chart
export default class SomeChart extends React.Component {
  render() {
    return (
      <DataConsumer>
        {({ accountSelection }) => {
          return (
            <div
              style={{
                padding: '5px'
              }}
            >
              <Header as="h2">Some Chart</Header>

              {accountSelection ? (
                <LineChart
                  accountId={accountSelection.value}
                  query="SELECT count(*) FROM Transaction FACET name TIMESERIES"
                />
              ) : (
                'Select an account to load chart'
              )}
            </div>
          );
        }}
      </DataConsumer>
    );
  }
}
