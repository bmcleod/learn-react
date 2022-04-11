import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

import ExamplesPage from './pages/ExamplesPage';
import CompositionalPatterns from './pages/CompositionalPatterns';
import JavascriptPatterns from './pages/JavascriptPatterns';
import PlopperPage from './pages/PlopperPage';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={Route}>
          <Switch>
            <Route path="/compositional-patterns">
              <CompositionalPatterns />
            </Route>
            <Route path="/js-patterns">
              <JavascriptPatterns />
            </Route>
            <Route path="/examples">
              <ExamplesPage />
            </Route>
            <Route path="/:segment">
              <ExamplesPage />
            </Route>
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
