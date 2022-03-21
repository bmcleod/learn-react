import * as React from 'react';
import * as UI from '@chakra-ui/react';

export const useSettingsDrawer = (): [
  React.HTMLAttributes<HTMLAnchorElement>,
  UI.DrawerProps
] => {
  const { isOpen, onOpen, onClose } = UI.useDisclosure();
  const cogLinkRef = React.useRef<HTMLAnchorElement>(null);

  const handleCogLinkClick: React.MouseEventHandler = (e) => {
    e.preventDefault();
    onOpen();
  };

  const triggerLinkProps = {
    ref: cogLinkRef,
    onClick: handleCogLinkClick,
  };

  const drawerProps: UI.DrawerProps = {
    isOpen,
    onClose,
    children: null,
  };

  return [triggerLinkProps, drawerProps];
};

export const SettingsDrawer: React.FC<UI.DrawerProps> = (props) => {
  return (
    <UI.Drawer placement="right" {...props}>
      <UI.DrawerOverlay />
      <UI.DrawerContent>
        <UI.DrawerCloseButton />
        <UI.DrawerHeader>Settings</UI.DrawerHeader>
      </UI.DrawerContent>
    </UI.Drawer>
  );
};
