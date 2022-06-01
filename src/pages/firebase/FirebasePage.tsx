import React from 'react';
import * as UI from '@chakra-ui/react';
import { ServerMessage } from './types';

import { signOut, useAuthState, useSignIn } from '../../firebase/auth';
import { addMessage, useMessages } from './data';
import { Button } from '@chakra-ui/react';
import * as icons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

  const getBGColor = (message: ServerMessage) => {
    const ONE_MIN = 1 * 60 * 1000;
    const FIVE_MIN = 5 * 60 * 1000;
    const now = Date.now();
    const messageTime: any = new Date(message.time);
    if (now - messageTime < ONE_MIN) {
      return 'beige';
    } else if (now - messageTime < FIVE_MIN) {
      return '#ffbdbd';
    }
    return 'transparent';
  };

  const filterByAuthor = (author: string) => {
    if (messages && author !== '') {
      const filtered = messages.filter(
        (message) => message.authorName === author
      );
      setFilteredMessages(filtered);
      setSearchMode(true);
    } else {
      setSearchMode(false);
    }
  };

  const blockAuthor = (author: string) => {
    if (messages && author !== '') {
      const filtered = messages.filter(
        (message) => message.authorName !== author
      );
      setFilteredMessages(filtered);
      setSearchMode(true);
    } else {
      setSearchMode(false);
    }
  };

  const clearFilters = () => {
    setFilteredMessages(messages);
    setSearchMode(false);
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
          style={{ marginRight: '10px' }}
        />
        <UI.Button marginRight="2px" colorScheme="green" onClick={handleSearch}>
          Search
        </UI.Button>
        <UI.Button
          colorScheme={searchMode ? 'red' : undefined}
          onClick={() => clearFilters()}
        >
          <FontAwesomeIcon icon={icons.faFilterCircleXmark} />
        </UI.Button>
      </UI.InputGroup>
      <UI.UnorderedList
        display="flex"
        flexDirection="column-reverse"
        height="78vmin"
        overflow="auto"
      >
        {!searchMode &&
          messages?.map((message) => (
            <UI.ListItem
              key={message.id}
              listStyleType="none"
              mb="3"
              alignContent="center"
              bgColor={getBGColor(message)}
            >
              <UI.Grid templateColumns="64px auto">
                <UI.GridItem>
                  <UI.Avatar name={message.authorName} src={message.avatar} />
                </UI.GridItem>
                <UI.GridItem>
                  <UI.Text fontSize="sm">
                    <UI.Menu>
                      <UI.MenuButton style={{ marginLeft: 'auto' }} as={Button}>
                        {message.authorName}
                      </UI.MenuButton>
                      <UI.MenuList>
                        <UI.MenuItem
                          onClick={() => filterByAuthor(message.authorName)}
                        >
                          Filter by this author
                        </UI.MenuItem>
                        <UI.MenuItem
                          onClick={() => blockAuthor(message.authorName)}
                        >
                          Block Messages from Author
                        </UI.MenuItem>
                      </UI.MenuList>
                    </UI.Menu>{' '}
                    on {new Date(message.time).toLocaleString('en-US')}
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
              bgColor={getBGColor(message)}
            >
              <UI.Grid templateColumns="64px auto">
                <UI.GridItem>
                  <UI.Avatar name={message.authorName} src={message.avatar} />
                </UI.GridItem>
                <UI.GridItem>
                  <UI.Text fontSize="sm">
                    <UI.Menu>
                      <UI.MenuButton style={{ marginLeft: 'auto' }} as={Button}>
                        {message.authorName}
                      </UI.MenuButton>
                      <UI.MenuList>
                        <UI.MenuItem>Filter by this author</UI.MenuItem>
                      </UI.MenuList>
                    </UI.Menu>
                    on {new Date(message.time).toLocaleString('en-US')}
                  </UI.Text>
                  <UI.Text>{message.text}</UI.Text>
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

  console.log(user);

  const handleAddClick = () => {
    addMessage({
      text: message,
      authorName: user.displayName || 'John Doe',
      email: user.email || '',
      uid: user.uid,
      time: Date.now(),
    });
    setMessage('');
  };

  return (
    <React.Fragment>
      <div style={{ display: 'flex' }}>
        <UI.Menu>
          <UI.MenuButton style={{ marginLeft: 'auto' }} as={Button}>
            Actions
          </UI.MenuButton>
          <UI.MenuList>
            <UI.MenuItem onClick={() => signOut()}>Sign Out</UI.MenuItem>
          </UI.MenuList>
        </UI.Menu>
      </div>

      <UI.Box>
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
            style={{ marginRight: '10px' }}
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
