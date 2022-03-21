import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { PlasmicRootProvider } from '@plasmicapp/loader-react';

import { PLASMIC } from './plasmic-init';
import Xano from './providers/XanoProvider';
import ExamplesPage from './pages/ExamplesPage';
import CompositionalPatterns from './pages/CompositionalPatterns';
import JavascriptPatterns from './pages/JavascriptPatterns';
import TodosPage from './pages/TodosPage';
import CatchAllPage from './pages/CatchAllPage';
import PlasmicCagePage from './pages/PlasmicCagePage';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <PlasmicRootProvider loader={PLASMIC}>
      <Xano.Provider specURL="x8ki-letl-twmt.n7.xano.io/apispec:KH9oIQzX">
        <BrowserRouter>
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
              <Route path="/plasmic-cage">
                <PlasmicCagePage />
              </Route>
              <Route path="/">
                <HomePage />
              </Route>
              <Route component={CatchAllPage} />
            </Switch>
          </QueryParamProvider>
        </BrowserRouter>
      </Xano.Provider>
    </PlasmicRootProvider>
  );
};

export default App;
