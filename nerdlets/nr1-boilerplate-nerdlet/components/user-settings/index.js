import React from 'react';
import { Modal, Button, Form, Popup, Icon } from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';
import { writeUserDocument } from '../../context/utils';
import _ from 'lodash';

// https://react.semantic-ui.com/collections/form/
// https://react.semantic-ui.com/modules/modal/
// https://lodash.com/docs/4.17.15#debounce

export default class UserSettings extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      createOpen: false
    };
  }

  handleOpen = () => this.setState({ createOpen: true });
  handleClose = () => this.setState({ createOpen: false });

  // debounce the input to continously save easily
  handleInput = _.debounce(
    (field, value, userSettings, updateDataStateContext) => {
      userSettings[field] = value;
      writeUserDocument('UserSettings', 'main', userSettings);
      updateDataStateContext({ userSettings });
    },
    700
  );

  render() {
    const { createOpen } = this.state;

    return (
      <DataConsumer>
        {({ userSettings, accounts, updateDataStateContext }) => {
          const accountOptions = accounts.map(a => ({
            key: a.id,
            value: a.id,
            text: a.name
          }));

          return (
            <Modal
              dimmer="inverted"
              closeIcon
              open={createOpen}
              onClose={this.handleClose}
              size="small"
              trigger={
                <Popup
                  basic
                  content="User Settings"
                  trigger={
                    <Button
                      onClick={this.handleOpen}
                      style={{ height: '45px' }}
                      className="filter-button"
                    >
                      <Icon.Group
                        size="large"
                        style={{
                          marginTop: '5px',
                          marginLeft: '8px',
                          marginRight: '-10px'
                        }}
                      >
                        <Icon name="user" />
                        <Icon corner="bottom right" name="cog" />
                      </Icon.Group>
                    </Button>
                  }
                />
              }
            >
              <Modal.Header>Settings</Modal.Header>
              <Modal.Content>
                <Form>
                  <Form.Group>
                    <Form.Dropdown
                      label="Favorite Account"
                      options={accountOptions}
                      selection
                      defaultValue={userSettings.favoriteAccount || undefined}
                      onChange={(e, d) =>
                        this.handleInput(
                          'favoriteAccount',
                          d.value,
                          userSettings,
                          updateDataStateContext
                        )
                      }
                    />

                    <Form.Input
                      label="Favorite Color"
                      defaultValue={userSettings.favoriteColor || undefined}
                      onChange={e =>
                        this.handleInput(
                          'favoriteColor',
                          e.target.value,
                          userSettings,
                          updateDataStateContext
                        )
                      }
                    />

                    <Form.Input
                      label="Some Field"
                      defaultValue={userSettings.someField || undefined}
                      onChange={e =>
                        this.handleInput(
                          'someField',
                          e.target.value,
                          userSettings,
                          updateDataStateContext
                        )
                      }
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Button
                      color="red"
                      content="Clear Settings"
                      onClick={async () => {
                        await writeUserDocument('UserSettings', 'main', {});
                        updateDataStateContext({ userSettings: {} });
                        this.handleClose();
                      }}
                    />
                  </Form.Group>
                </Form>
              </Modal.Content>
            </Modal>
          );
        }}
      </DataConsumer>
    );
  }
}
