import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import HomePage from './pages/Home';
import CommentPage from './pages/Comment';

const App = () => {
  return (
    <BrowserRouter>
      <div className="container mx-auto px-20 m-5">
        <Switch>
          <Route path="/" component={HomePage} exact={true} />
          <Route path="/comment/:id" component={CommentPage} exact={true} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;