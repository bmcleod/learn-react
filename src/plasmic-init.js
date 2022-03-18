import { initPlasmicLoader } from '@plasmicapp/loader-react';
export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: 'izpLuD9XfjEg4waoVkj7iA', // ID of a project you are using
      token:
        'xrAXUVLoyTCw0ft5Dod1vnOTLjtFEHaealWHzrJrUEnj6lM57HocbbaKxTytrI6Hwiu8aEzwJmvyCmTMHFqPg', // API token for that project
    },
  ],
  // Fetches the latest revisions, whether or not they were unpublished!
  // Disable for production to ensure you render only published changes.
  preview: true,
});
