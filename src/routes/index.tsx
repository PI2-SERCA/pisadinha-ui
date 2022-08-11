import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { Home } from '../pages/Home';
import { Room } from '../pages/Room';
import { Cut } from '../pages/Cut';

const Routes: React.FC = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/room" component={Room} />
      <Route exact path="/cut" component={Cut} />

      <Redirect to="/" />
    </Switch>
  </Router>
);

export default Routes;
