import React from 'react';
import _ from 'lodash';
import * as UI from '@chakra-ui/react';
import SanitizedHTML from 'react-sanitized-html';
import sanitizeHTML from 'sanitize-html';
import StackGrid from 'react-stack-grid';
import ReactPlayer from 'react-player';

import { PastedItem } from './pastedItem';
import { useAuthState } from '../auth';
import useInnerElementBackgroundColor from '../helpers/useInnerElementBackgroundColor';
import useMonitorStackGridImages from '../helpers/useMonitorStackGridImages';
import { SignInButton, SignOutButton } from '../auth/AuthButton';
import PrivacyWarning from './PrivacyWarning';
import PlopperProvider, { usePlopper } from './PlopperProvider';

const COLUMN_WIDTH = 480;

const PastedItemWrapper = React.forwardRef<HTMLDivElement, UI.BoxProps>(
  (props, ref) => {
    return (
      <UI.Box
        ref={ref}
        bg="white"
        borderRadius="lg"
        overflow="hidden"
        p={4}
        {...props}
      />
    );
  }
);

const HTMLTextItem: React.FC<{ item: PastedItem }> = ({ item }) => {
  const { ref, backgroundColor } = useInnerElementBackgroundColor(':scope>*>*');

  if (item.data.type !== 'text') return null;

  return (
    <PastedItemWrapper ref={ref} bg={backgroundColor}>
      <SanitizedHTML
        allowedAttributes={{
          ...sanitizeHTML.defaults.allowedAttributes,
          '*': ['style'],
        }}
        html={item.data.text.html}
      />
    </PastedItemWrapper>
  );
};

const PlainTextItem: React.FC<{ item: PastedItem }> = ({ item }) => {
  if (item.data.type !== 'text') return null;

  return (
    <PastedItemWrapper>
      {item.data.text.plain.split('\n').map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </PastedItemWrapper>
  );
};

const ImageItem: React.FC<{ item: PastedItem }> = ({ item }) => {
  if (item.data.type !== 'image') return null;

  return (
    <PastedItemWrapper p={0}>
      <UI.Image src={item.data.src} alt="..." w="100%" />
    </PastedItemWrapper>
  );
};

const URLItem: React.FC<{ item: PastedItem }> = ({ item }) => {
  if (item.data.type !== 'url') return null;

  const url = new URL(item.data.url);
  const meta = item.data.meta;

  return (
    <PastedItemWrapper p={0}>
      <UI.Box as="a" href={url.toString()} target="_blank">
        <UI.Image src={meta.image} alt={meta.description} />
        <UI.Box p={4}>
          <UI.Text fontWeight="bold" mb={2}>
            {meta.title}
          </UI.Text>
          <UI.Text color="gray.500" fontSize="sm">
            {url.hostname}
          </UI.Text>
        </UI.Box>
      </UI.Box>
    </PastedItemWrapper>
  );
};

const PlayerItem: React.FC<{ item: PastedItem }> = ({ item }) => {
  if (item.data.type !== 'player') return null;

  const playerAspectRatio = 16 / 9;
  const width = COLUMN_WIDTH;
  const height = Math.floor(width / playerAspectRatio);

  return (
    <PastedItemWrapper p={0}>
      <ReactPlayer url={item.data.url} width={width} height={height} />
    </PastedItemWrapper>
  );
};

const PastedItemGridItem: React.FC<{
  item: PastedItem;
  onRemoveClick: () => any;
}> = ({ item, onRemoveClick }) => {
  return (
    <UI.Box position="relative">
      <UI.Button
        position="absolute"
        top={2}
        right={2}
        onClick={onRemoveClick}
        size="xs"
        colorScheme="red"
      >
        Delete
      </UI.Button>

      {item.data.type === 'text' ? (
        <React.Fragment>
          {item.data.text.html ? (
            <HTMLTextItem item={item} />
          ) : (
            <PlainTextItem item={item} />
          )}
        </React.Fragment>
      ) : null}
      {item.data.type === 'image' ? <ImageItem item={item} /> : null}
      {item.data.type === 'url' ? <URLItem item={item} /> : null}
      {item.data.type === 'player' ? <PlayerItem item={item} /> : null}
    </UI.Box>
  );
};

const PastedItemGrid: React.FC = () => {
  const pastingContext = usePlopper();
  const [imageContainerRef, stackGridRef] = useMonitorStackGridImages();

  return (
    <React.Fragment>
      <UI.Box ref={imageContainerRef}>
        {_.isEmpty(pastingContext.itemDocs) ? null : (
          <StackGrid
            ref={stackGridRef}
            columnWidth={COLUMN_WIDTH}
            gutterWidth={12}
            gutterHeight={12}
            duration={300}
          >
            {pastingContext.itemDocs
              .slice()
              .reverse()
              .map((itemDoc) => (
                <PastedItemGridItem
                  key={itemDoc.id}
                  item={itemDoc}
                  onRemoveClick={() => pastingContext.remove(itemDoc.id)}
                />
              ))}
          </StackGrid>
        )}
      </UI.Box>
      <UI.Box
        textAlign="center"
        bg="white"
        borderRadius="lg"
        maxWidth="420px"
        p={4}
        mx="auto"
        mt={8}
      >
        <UI.Heading size="md" mb={4}>
          Try pasting something!
        </UI.Heading>
        <UI.List color="gray.500" fontSize="sm">
          <UI.ListItem>Plain text or rich text</UI.ListItem>
          <UI.ListItem>Images or links</UI.ListItem>
          <UI.ListItem>Videos from YouTube or Twitch</UI.ListItem>
        </UI.List>
      </UI.Box>
    </React.Fragment>
  );
};

const PlopperPage: React.FC = () => {
  const [user] = useAuthState();

  const heading = (
    <UI.SimpleGrid columns={3} alignItems="center">
      <UI.Box />
      <UI.Heading textAlign="center" my={4} color="gray.500">
        plopper.
      </UI.Heading>
      <UI.Box textAlign="right" px={4}>
        {user ? (
          <SignOutButton colorScheme="black" variant="outline" size="xs" />
        ) : null}
      </UI.Box>
    </UI.SimpleGrid>
  );

  return user ? (
    <React.Fragment>
      <PrivacyWarning />
      {heading}
      <PlopperProvider>
        <UI.Box p={4}>
          <PastedItemGrid />
        </UI.Box>
      </PlopperProvider>
    </React.Fragment>
  ) : (
    <React.Fragment>
      {heading}
      <UI.Box textAlign="center" p={4}>
        <SignInButton colorScheme="green" />
      </UI.Box>
    </React.Fragment>
  );
};

export default PlopperPage;
