import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

import PlopperPage from './plopper/PlopperPage';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={Route}>
          <Switch>
            <Route path="/">
              <PlopperPage />
            </Route>
          </Switch>
        </QueryParamProvider>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default App;
