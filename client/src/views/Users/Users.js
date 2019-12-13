import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';

import { userService } from '../../services/user.service';

function UserRow(props) {
  const user = props.user
  const userLink = `/users/${user.id}`

  return (
    <tr key={user.id.toString()}>
      <th scope="row"><Link to={userLink}>{user.id}</Link></th>
      <td><Link to={userLink}>{user.email}</Link></td>
      <td>{user.role}</td>
    </tr>
  )
}

class Users extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: null,
    }
  }

  componentDidMount() {
    userService.getAll()
      .then(users => {
        if (users && users.length > 0) {
          this.setState({users});
        }
      })
  }

  render() {

    const userList = this.state.users;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={9}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Users <small className="text-muted">example</small>
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col">id</th>
                      <th scope="col">email</th>
                      <th scope="col">role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList ? userList.map((user, index) =>
                      <UserRow key={index} user={user}/>
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

export default Users;
