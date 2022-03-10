import React from 'react';
import * as UI from '@chakra-ui/react';
import TabCarouselControl from '../components/TabCarouselControl';
import _ from 'lodash';

const TabContextDemoPage: React.FC = () => {
  return (
    <React.Fragment>
      <UI.Box p={8} bg="white" mb={4}>
        <UI.Tabs>
          <UI.TabList>
            <UI.Tab>One</UI.Tab>
            <UI.Tab>Two</UI.Tab>
            <UI.Tab>Three</UI.Tab>
          </UI.TabList>
          <UI.TabPanels>
            <UI.TabPanel>
              <p>Tab Content One</p>
            </UI.TabPanel>
            <UI.TabPanel>
              <p>Tab Content Two</p>
            </UI.TabPanel>
            <UI.TabPanel>
              <p>Tab Content Three</p>
            </UI.TabPanel>
          </UI.TabPanels>
        </UI.Tabs>
      </UI.Box>

      <UI.Box p={8} bg="white" mb={4}>
        <UI.Tabs>
          <TabCarouselControl mode="top">
            <UI.Text>One</UI.Text>
            <UI.Text>Two</UI.Text>
            <UI.Text>Three</UI.Text>
          </TabCarouselControl>
          <UI.TabPanels>
            <UI.TabPanel>
              <p>Tab Content One</p>
            </UI.TabPanel>
            <UI.TabPanel>
              <p>Tab Content Two</p>
            </UI.TabPanel>
            <UI.TabPanel>
              <p>Tab Content Three</p>
            </UI.TabPanel>
          </UI.TabPanels>
          <TabCarouselControl mode="bottom">
            <UI.Text>One</UI.Text>
            <UI.Text>Two</UI.Text>
            <UI.Text>Three</UI.Text>
          </TabCarouselControl>
        </UI.Tabs>
      </UI.Box>
    </React.Fragment>
  );
};

export default TabContextDemoPage;
