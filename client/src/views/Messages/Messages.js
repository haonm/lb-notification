import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';

import MessageRow from './MesageRow';

import { messageService } from '../../services/message.service';

class Messages extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: null,
    }
  }


  componentDidMount() {
    messageService.getAll()
      .then(msg => {
        if (msg && msg.length > 0) {
          this.setState({messages: msg});
        }
      })
  }

  render() {

    const messageList = this.state.messages;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={9}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Messages <small className="text-muted">list</small>
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col">id</th>
                      <th scope="col">content</th>
                      <th scope="col">version</th>
                      <th scope="col" width="120"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {messageList ? messageList.map((msg, index) =>
                      <MessageRow key={index} message={msg}/>
                    ) : null}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Messages;
