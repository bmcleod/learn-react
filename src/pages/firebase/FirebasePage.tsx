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
      <input
        type="search"
        id="search"
        value={searchTerm}
        placeholder="Search message history"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <UI.Button colorScheme="green" onClick={handleSearch}>
        Search
      </UI.Button>
      <UI.UnorderedList>
        {!searchMode &&
          messages?.map((message) => (
            <UI.ListItem key={message.id}>
              <UI.Avatar
                name={message.authorName}
                src={`https://www.gravatar.com/avatar/${Md5.hashAsciiStr(
                  message.email || 'lbmcleod@gmail.com'
                )}`}
              />
              <UI.Text>
                {message.authorName}: {message.text} at {message.time}
              </UI.Text>
            </UI.ListItem>
          ))}
        {searchMode &&
          filteredMessages?.map((message) => (
            <UI.ListItem key={message.id}>
              <UI.Avatar
                name={message.authorName}
                src={`https://www.gravatar.com/avatar/${Md5.hashAsciiStr(
                  message.email || 'lbmcleod@gmail.com'
                )}`}
              />
              <UI.Text>
                {message.authorName}: {message.text} at {message.time}
              </UI.Text>
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
      <UI.Divider />
      <MessageList />
      <UI.Divider />
      <input
        type="text"
        placeholder="Message"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <UI.Button colorScheme="green" onClick={handleAddClick}>
        Add test message
      </UI.Button>
    </React.Fragment>
  );
};

export default FirebasePage;
