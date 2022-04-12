import React from 'react';
import * as UI from '@chakra-ui/react';

const GetStartedTips: React.FC<UI.BoxProps> = (props) => {
  return (
    <UI.Box textAlign="center" bg="white" borderRadius="lg" p={4} {...props}>
      <UI.Heading size="md" mb={4}>
        Try pasting something!
      </UI.Heading>
      <UI.List color="gray.500" fontSize="sm">
        <UI.ListItem>Plain text or rich text</UI.ListItem>
        <UI.ListItem>Images or links</UI.ListItem>
        <UI.ListItem>Videos from YouTube or Twitch</UI.ListItem>
      </UI.List>
    </UI.Box>
  );
};

export default GetStartedTips;
