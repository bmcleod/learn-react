import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
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
              <DndProvider backend={HTML5Backend}>
                <PlopperPage />
              </DndProvider>
            </Route>
          </Switch>
        </QueryParamProvider>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default App;
