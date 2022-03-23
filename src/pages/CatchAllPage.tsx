import React from 'react';
import {
  PlasmicComponent,
  ComponentRenderData,
} from '@plasmicapp/loader-react';

import { PLASMIC } from '../plasmic-init';

// We try loading the Plasmic page for the current route.
// If it doesn't exist, then return "Not found."
export const CatchAllPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [pageData, setPageData] = React.useState<ComponentRenderData | null>(
    null
  );

  React.useEffect(() => {
    async function load() {
      const pageData = await PLASMIC.maybeFetchComponentData(
        window.location.pathname
      );
      setPageData(pageData);
      setLoading(false);
    }
    load();
  }, []);

  const title = pageData?.entryCompMetas[0].pageMetadata?.title;
  if (title) {
    window.document.title = title;
  }
  // TODO: other meta tags

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!pageData) {
    return <div>Not found</div>;
  }
  // The page will already be cached from the `load` call above.
  return <PlasmicComponent component={window.location.pathname} />;
};

export default CatchAllPage;
