import React from 'react';
import * as UI from '@chakra-ui/react';
import { Message, ServerMessage } from './types';
import { Md5 } from 'ts-md5/dist/md5';

import { signOut, useAuthState, useSignIn } from '../../firebase/auth';
import { addMessage, useMessages } from './data';

export const SignInButton: React.FC = () => {
  const [signIn, , loading] = useSignIn();

  return (
    <UI.Button
      colorScheme="green"
      onClick={() => {
        signIn();
      }}
      disabled={loading}
    >
      Sign In with Google
    </UI.Button>
  );
};

const MessageList: React.FC = () => {
  const [messages, loading, error] = useMessages({ limit: 100 });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchMode, setSearchMode] = React.useState<boolean>(false);
  const [filteredMessages, setFilteredMessages] =
    React.useState<ServerMessage[]>();

  if (loading) return <UI.Spinner />;
  if (error) return <UI.Text>{error.message}</UI.Text>;

  const handleSearch = () => {
    if (messages && searchTerm !== '') {
      const filtered = messages.filter((message) =>
        message.text.includes(searchTerm)
      );
      setFilteredMessages(filtered);
      setSearchMode(true);
    } else {
      setSearchMode(false);
    }
  };

  return (
    <React.Fragment>
      <UI.InputGroup padding="20px">
        <UI.Input
          type="search"
          id="search"
          value={searchTerm}
          placeholder="Search message history"
          onChange={(e) => setSearchTerm(e.target.value)}
          background="white"
        />
        <UI.Button colorScheme="green" onClick={handleSearch}>
          Search
        </UI.Button>
      </UI.InputGroup>
      <UI.UnorderedList
        display="flex"
        flexDirection="column-reverse"
        height="80vmin"
        overflow="auto"
      >
        {!searchMode &&
          messages?.map((message) => (
            <UI.ListItem
              key={message.id}
              listStyleType="none"
              mb="3"
              alignContent="center"
            >
              <UI.Grid templateColumns="64px auto">
                <UI.GridItem>
                  <UI.Avatar
                    name={message.authorName}
                    src={`https://www.gravatar.com/avatar/${Md5.hashAsciiStr(
                      message.email || 'lbmcleod@gmail.com'
                    )}`}
                  />
                </UI.GridItem>
                <UI.GridItem>
                  <UI.Text fontSize="sm">
                    {message.authorName} on{' '}
                    {new Date(message.time).toLocaleString('en-US')}
                  </UI.Text>
                  <UI.Text>{message.text}</UI.Text>
                </UI.GridItem>
              </UI.Grid>
            </UI.ListItem>
          ))}
        {searchMode &&
          filteredMessages?.map((message) => (
            <UI.ListItem
              key={message.id}
              listStyleType="none"
              mb="3"
              alignContent="center"
            >
              <UI.Grid templateColumns="64px auto">
                <UI.GridItem>
                  <UI.Avatar
                    name={message.authorName}
                    src={`https://www.gravatar.com/avatar/${Md5.hashAsciiStr(
                      message.email || 'lbmcleod@gmail.com'
                    )}`}
                  />
                </UI.GridItem>
                <UI.GridItem>
                  <UI.Text>
                    {message.authorName}: {message.text} at {message.time}
                  </UI.Text>
                </UI.GridItem>
              </UI.Grid>
            </UI.ListItem>
          ))}
      </UI.UnorderedList>
    </React.Fragment>
  );
};

const FirebasePage: React.FC = () => {
  const [user, loading, error] = useAuthState();
  const [message, setMessage] = React.useState('');

  if (loading) return <UI.Spinner />;
  if (error) return <UI.Text>{error.message}</UI.Text>;
  if (!user) return <SignInButton />;

  const handleAddClick = () => {
    addMessage({
      text: message,
      authorName: user.displayName || 'John Doe',
      email: user.email || 'lbmcleod@gmail.com',
      uid: user.uid,
      time: Date.now(),
    });
    setMessage('');
  };

  return (
    <React.Fragment>
      <UI.Button colorScheme="green" onClick={() => signOut()}>
        Sign Out
      </UI.Button>
      <UI.Box height="87vmin" overflowY="scroll">
        <MessageList />
      </UI.Box>
      <UI.Box padding="25px">
        <UI.InputGroup>
          <UI.Input
            type="text"
            placeholder="Message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            background="white"
          />
          <UI.Button colorScheme="green" onClick={handleAddClick}>
            Send
          </UI.Button>
        </UI.InputGroup>
      </UI.Box>
    </React.Fragment>
  );
};

export default FirebasePage;
