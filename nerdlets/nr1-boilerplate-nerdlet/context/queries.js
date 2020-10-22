import gql from 'graphql-tag';

export const accountsQuery = gql`
  {
    actor {
      accounts(scope: GLOBAL) {
        reportingEventTypes
        id
        name
      }
    }
  }
`;
