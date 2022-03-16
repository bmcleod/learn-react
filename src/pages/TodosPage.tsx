import React from 'react';
import * as UI from '@chakra-ui/react';
import { formatDistance } from 'date-fns';

import Xano from '../providers/XanoProvider';

interface Todo {
  id: number;
  created_at: number;
  task: string;
  completed: boolean;
  important: boolean;
}

const TodosList: React.FC = () => {
  const { loading, error, data: todos } = Xano.useXano<Todo[]>('getTodo');
  const [updateTodo] = Xano.useXanoMethod('updateTodoById');

  const toggleTodoCompleted = (todo: Todo) => {
    updateTodo(todo.id, {
      ...todo,
      completed: !todo.completed,
    });
  };

  if (loading) return <UI.Spinner />;
  if (error) return <UI.Alert>Uh oh.</UI.Alert>;

  return (
    <UI.List mb={2}>
      {todos.map((todo) => (
        <UI.ListItem key={todo.id}>
          <UI.Checkbox
            defaultChecked={todo.completed}
            onChange={() => toggleTodoCompleted(todo)}
          >
            <UI.Text as="span" color={todo.important ? 'red.600' : ''}>
              {todo.task}
            </UI.Text>{' '}
            <UI.Text as="span" fontSize="sm" color="gray.400">
              (added{' '}
              {formatDistance(new Date(todo.created_at), new Date(), {
                addSuffix: true,
              })}
              )
            </UI.Text>
          </UI.Checkbox>
        </UI.ListItem>
      ))}
    </UI.List>
  );
};

const TodosPage: React.FC = () => {
  return (
    <Xano.Provider specURL="x8ki-letl-twmt.n7.xano.io/apispec:KH9oIQzX">
      <UI.Box p={8} bg="white">
        <UI.Heading mb={4}>Todos</UI.Heading>

        <TodosList />
      </UI.Box>
    </Xano.Provider>
  );
};

export default TodosPage;
