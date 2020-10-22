import React from 'react';
import { NrqlQuery } from 'nr1';
import { Divider, Header, Input } from 'semantic-ui-react';
import _ from 'lodash';

export default class GetNrqlData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountId: null,
      nrqlQuery: `SELECT count(*) FROM Transaction FACET appName LIMIT 2`,
      nrqlData: null
    };
  }

  componentDidMount() {
    this.updateData(this.props);
  }

  componentDidUpdate() {
    this.updateData(this.props);
  }

  updateData = props => {
    const { accountId } = props;
    const { nrqlQuery } = this.state;

    if (accountId !== this.state.accountId) {
      this.setState({ accountId }, () => {
        if (accountId) {
          // https://developer.newrelic.com/components/nrql-query
          NrqlQuery.query({
            accountId,
            query: nrqlQuery
          })
            .then(value => {
              this.setState({ nrqlData: value });
            })
            .catch(err => {
              this.setState({ nrqlData: { error: err.message } });
            });
        } else {
          this.setState({ nrqlData: null });
        }
      });
    }
  };

  // debounce the input to update save easily
  handleInput = _.debounce((field, value) => {
    this.setState({ [field]: value }, () => {
      if (field === 'nrqlQuery' && this.state.accountId) {
        NrqlQuery.query({
          accountId: this.state.accountId,
          query: value
        })
          .then(value => {
            this.setState({ nrqlData: value });
          })
          .catch(err => {
            this.setState({ nrqlData: { error: err.message } });
          });
      }
    });
  }, 700);

  render() {
    const { accountId, nrqlData, nrqlQuery } = this.state;

    return (
      <div
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        <div>
          <Header as="h3" content="Get NRQL Data" />
          <Input
            label="Nrql Query"
            style={{ width: '375px' }}
            defaultValue={nrqlQuery}
            onChange={e => this.handleInput('nrqlQuery', e.target.value)}
          />
          <Divider />
          {accountId ? (
            <pre id="json">{JSON.stringify(nrqlData, null, 4)}</pre>
          ) : (
            'No account selected.'
          )}
        </div>
      </div>
    );
  }
}
