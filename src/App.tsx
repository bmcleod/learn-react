import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

import AuthProvider from './auth/AuthProvider';
import AuthButton from './auth/AuthButton';
import PrivacyWarning from './components/PrivacyWarning';
import ExamplesPage from './pages/ExamplesPage';
import CompositionalPatterns from './pages/CompositionalPatterns';
import JavascriptPatterns from './pages/JavascriptPatterns';
import PlopperPage from './pages/PlopperPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <PrivacyWarning />
      <AuthButton />
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
    </AuthProvider>
  );
};

export default App;
