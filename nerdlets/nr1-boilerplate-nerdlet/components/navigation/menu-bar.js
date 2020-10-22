/* eslint 
no-console: 0
*/
import React from 'react';
import Select from 'react-select';
import UserSettings from '../user-settings';
import { DataConsumer } from '../../context/data';

export default class MenuBar extends React.PureComponent {
  render() {
    return (
      <DataConsumer>
        {({ accounts, accountSelection, updateDataStateContext }) => {
          const accountOptions = accounts.map(a => ({
            key: a.id,
            value: a.id,
            text: a.name,
            label: a.name,
            events: a.reportingEventTypes,
            type: 'account'
          }));

          return (
            <div>
              <div className="utility-bar">
                <div
                  className="react-select-input-group"
                  style={{ width: '250px' }}
                >
                  <label>Select Account</label>
                  <Select
                    options={accountOptions}
                    onChange={s =>
                      updateDataStateContext({ accountSelection: s })
                    }
                    value={accountSelection}
                    classNamePrefix="react-select"
                  />
                </div>

                <div className="flex-push" />

                <UserSettings />
              </div>
            </div>
          );
        }}
      </DataConsumer>
    );
  }
}
