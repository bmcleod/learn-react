import React from 'react';
import * as UI from '@chakra-ui/react';
import { PlasmicComponent } from '@plasmicapp/loader-react';
import { formatDistance } from 'date-fns';

import { Todo } from '../types';
import Xano from '../providers/XanoProvider';

const PlasmicXanoPage: React.FC = () => {
  const { loading, error, data: todos } = Xano.useXano<Todo[]>('getTodo');

  if (loading) return <UI.Spinner />;
  if (error) return <UI.Alert>Uh oh.</UI.Alert>;

  return (
    <PlasmicComponent
      component="Home"
      componentProps={{
        productGrid: {
          props: {
            children: todos.map((todo) => (
              <PlasmicComponent
                key={todo.id}
                component="ProductCard"
                componentProps={{
                  title: todo.task,
                  price: formatDistance(new Date(todo.created_at), new Date(), {
                    addSuffix: true,
                  }),
                  ratings: null,
                  image: (
                    <img
                      alt={todo.task}
                      src="https://www.placecage.com/c/160/160"
                    />
                  ),
                }}
              />
            )),
          },
        },
      }}
    />
  );
};

export default PlasmicXanoPage;
