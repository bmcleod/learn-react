import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { PlasmicRootProvider } from '@plasmicapp/loader-react';

import { PLASMIC } from './plasmic-init';
import ExamplesPage from './pages/ExamplesPage';
import CompositionalPatterns from './pages/CompositionalPatterns';
import JavascriptPatterns from './pages/JavascriptPatterns';
import TodosPage from './pages/TodosPage';
import CatchAllPage from './pages/CatchAllPage';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <PlasmicRootProvider loader={PLASMIC}>
      <BrowserRouter>``
        <QueryParamProvider ReactRouterRoute={Route}>
          <Switch>
            <Route path="/compositional-patterns">
              <CompositionalPatterns />
            </Route>
            <Route path="/js-patterns">
              <JavascriptPatterns />
            </Route>
            <Route path="/todos">
              <TodosPage />
            </Route>
            <Route path="/examples:segment">
              <ExamplesPage />
            </Route>
            <Route path="/examples">
              <ExamplesPage />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
            <Route component={CatchAllPage} />
          </Switch>
        </QueryParamProvider>
      </BrowserRouter>
    </PlasmicRootProvider>
  );
};

export default App;
