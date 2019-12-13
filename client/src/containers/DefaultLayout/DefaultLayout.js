import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import {API_URL} from '../../configs';
import openSocket from 'socket.io-client';

import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

const socket = openSocket(API_URL);

class DefaultLayout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      notifyModal: false,
      updateData: '',
      listening: false,
    };

    this.toggleInfo = this.toggleInfo.bind(this);
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e) {
    e.preventDefault()
    this.props.history.push('/login')
  }

  toggleInfo() {
    this.setState({
      notifyModal: !this.state.notifyModal,
    }, () => {
      if (this.props.location.pathname === '/messages') {
        window.location.reload(true);
      }
    });
  }

  componentDidMount() {
    const self = this;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.accessToken && currentUser.role === 'staff') {
      socket.on('updated_message', function(data) {
          // use the socket as usual
          console.log(data);
          self.setState({notifyModal: true, updateData: data});
      });
    }
  }

  render() {
    const notifyData = this.state.updateData;

    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense  fallback={this.loading()}>
            <DefaultHeader onLogout={e=>this.signOut(e)}/>
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
            <AppSidebarNav navConfig={navigation} {...this.props} router={router}/>
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} router={router}/>
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          localStorage.getItem('currentUser')
                          ? <route.component {...props} /> :
                          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                        )} />
                    ) : (null);
                  })}
                  <Redirect from="/" to="/users" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>

        <Modal isOpen={this.state.notifyModal} toggle={this.toggleInfo}
                className={'modal-info'}>
          <ModalHeader toggle={this.toggleInfo}>Message Updated!</ModalHeader>
          <ModalBody>
            {`Message id: ${notifyData ? notifyData.id : ''} has been updated with new version: ${notifyData ? notifyData.version : ''}`}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleInfo}>OK, refresh data</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default DefaultLayout;
