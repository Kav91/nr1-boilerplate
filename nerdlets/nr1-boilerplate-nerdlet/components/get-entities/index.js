import React from 'react';
import { DataConsumer } from '../../context/data';
import { Form } from 'semantic-ui-react';
import { NerdGraphQuery } from 'nr1';
import gql from 'graphql-tag';

// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction
// https://react.semantic-ui.com/collections/grid/

export default class GetEntities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entitySearchQuery: `domain = 'APM' and reporting = 'true'`,
      entitySearchCount: null
    };
  }

  fetchEntities = () => {
    const { entitySearchQuery } = this.state;
    const query = gql`{
      actor {
        entitySearch(query: "${entitySearchQuery}") {
          count
        }
      }
    }`;
    NerdGraphQuery.query({
      query
    }).then(nerdGraphData => {
      const result = nerdGraphData.data;
      const entitySearchCount =
        (((result || {}).actor || {}).entitySearch || {}).count || 0;

      this.setState({ entitySearchCount });
    });
  };

  render() {
    const { entitySearchQuery, entitySearchCount } = this.state;

    return (
      <DataConsumer>
        {({ updateDataStateContext }) => {
          return (
            <div>
              <Form>
                <Form.Group>
                  <Form.Input
                    width="16"
                    label="Entity Search Query"
                    value={entitySearchQuery}
                    onChange={e =>
                      this.setState({ entitySearchQuery: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Button
                    label="&nbsp;"
                    content="Fetch Entities"
                    onClick={() => this.fetchEntities()}
                  />
                  <Form.Button
                    style={{ display: entitySearchCount ? '' : 'none' }}
                    label={
                      entitySearchCount ? `Entities: ${entitySearchCount}` : ''
                    }
                    content="Save Entity Count"
                    onClick={() => {
                      this.setState({ entitySearchCount: null }, () => {
                        updateDataStateContext({ entitySearchCount });
                      });
                    }}
                  />
                </Form.Group>
              </Form>
            </div>
          );
        }}
      </DataConsumer>
    );
  }
}
