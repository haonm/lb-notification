import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';

import { userService } from '../../services/user.service';

class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
    }
  }

  componentDidMount() {
    userService.getUser(this.props.match.params.id)
      .then(user => {
        if (user) {
          this.setState({user});
        }
      })
  }

  render() {
    const currentUser = this.state.user;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>User id: {this.props.match.params.id}</strong>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>
                    <tbody>
                      {
                        currentUser ? Object.keys(currentUser).map((key) => {
                          return (
                            <tr key={key}>
                              <td>{`${key}:`}</td>
                              <td><strong>{currentUser[key]}</strong></td>
                            </tr>
                          )
                        }) : null
                      }
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

export default User;
