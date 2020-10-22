import React from 'react';
import { DataConsumer } from '../../context/data';
import { Form, List, Header } from 'semantic-ui-react';
import { NerdGraphQuery, navigation } from 'nr1';
import gql from 'graphql-tag';

// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction
// https://developer.newrelic.com/apis/navigation
// https://react.semantic-ui.com/collections/grid/

export default class GetEntities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entitySearchQuery: `domain = 'APM' and reporting = 'true'`,
      entitySearchCount: null,
      entities: null
    };
  }

  fetchEntities = () => {
    const { entitySearchQuery } = this.state;
    const query = gql`{
      actor {
        entitySearch(query: "${entitySearchQuery}") {
          count
          results {
            entities {
              name
              guid
            }
          }
        }
      }
    }`;
    NerdGraphQuery.query({
      query
    }).then(nerdGraphData => {
      const result = nerdGraphData.data;
      const entitySearchData =
        ((result || {}).actor || {}).entitySearch || null;

      if (entitySearchData) {
        const entitySearchCount = (entitySearchData || {}).count || 0;
        // use slice to take first 5 entities
        const entities =
          ((entitySearchData || {}).results || {}).entities.slice(0, 5) || null;

        this.setState({ entitySearchCount, entities });
      }
    });
  };

  render() {
    const { entitySearchQuery, entitySearchCount, entities } = this.state;

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
                      this.setState(
                        { entitySearchCount: null, entities: null },
                        () => {
                          updateDataStateContext({ entitySearchCount });
                        }
                      );
                    }}
                  />
                </Form.Group>
              </Form>

              {entities && entities.length > 0 ? (
                <>
                  <Header as="h5">First 5 entities</Header>
                  <List>
                    {entities.map(e => {
                      return (
                        <List.Item
                          key={e.guid}
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigation.openStackedEntity(e.guid)}
                        >
                          {e.name}
                        </List.Item>
                      );
                    })}
                  </List>
                </>
              ) : (
                ''
              )}
            </div>
          );
        }}
      </DataConsumer>
    );
  }
}
