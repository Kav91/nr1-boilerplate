import React from 'react';
import { DataConsumer } from '../../context/data';
import { Button, Grid, Header, Image } from 'semantic-ui-react';
import FavColor from '../fav-color';
import GetEntities from '../get-entities';
import SomeChart from '../some-chart';
import GetNrqlData from '../get-nrql-data';

// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction
// https://react.semantic-ui.com/collections/grid/

export default class GridSystem extends React.Component {
  render() {
    // const { height, width } = this.props;

    return (
      <DataConsumer>
        {({ accountSelection, updateDataStateContext, entitySearchCount }) => {
          return (
            <Grid
              columns={3}
              style={{
                paddingTop: '5px',
                paddingLeft: '5px',
                paddingRight: '5px'
              }}
            >
              <Grid.Row>
                <Grid.Column>
                  <div>
                    <Header as="h3">My NR1 Boilerplate App</Header>
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <Header as="h3">
                    Selected Account:
                    {(accountSelection && accountSelection.text) ||
                      ' None selected'}
                  </Header>

                  {accountSelection ? (
                    <Button
                      content="Deselect Account"
                      onClick={() =>
                        updateDataStateContext({ accountSelection: null })
                      }
                    />
                  ) : (
                    ''
                  )}
                </Grid.Column>
                <Grid.Column>
                  <FavColor />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <GetEntities />
                </Grid.Column>
                <Grid.Column>
                  <div>
                    <Header as="h3">
                      Saved Entity Search Count: {entitySearchCount}
                    </Header>
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <SomeChart />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <Image src="https://react.semantic-ui.com/images/wireframe/media-paragraph.png" />
                </Grid.Column>
                <Grid.Column>
                  <Image src="https://react.semantic-ui.com/images/wireframe/media-paragraph.png" />
                </Grid.Column>
                <Grid.Column>
                  <Image src="https://react.semantic-ui.com/images/wireframe/media-paragraph.png" />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={3}>
                  <GetNrqlData
                    accountId={
                      (accountSelection && accountSelection.value) || null
                    }
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          );
        }}
      </DataConsumer>
    );
  }
}
