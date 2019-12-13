import React, { Component } from 'react';
import { messageService } from '../../services/message.service';
import { Input, Button } from 'reactstrap';

export default class MessageRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: props.message.version,
      updating: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleUpdate() {
    this.setState({updating: true});
    const msg = this.props.message;
    messageService.update({...msg, version: this.state.version})
      .then(res => {
        this.setState({updating: false});
      });
  }

  render() {
    const {message} = this.props;

    return (
      <tr key={message.id.toString()}>
        <th scope="row">{message.id}</th>
        <td>{message.content}</td>
        <td>
          <Input
            type="text"
            value={this.state.version}
            name="version"
            onChange={this.handleChange}
            disabled={this.currentUser.role !== 'admin'}
          />
        </td>
        <td>
          <Button block color="primary" disabled={this.currentUser.role !== 'admin' || this.state.updating} onClick={this.handleUpdate}>
            {this.state.updating ? 'Updating...' : 'Update'}
          </Button>
        </td>
      </tr>
    )
  }
}
