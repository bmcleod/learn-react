import React from 'react';
import { OpenAPIProvider } from 'react-openapi-client';
import useAxios from 'axios-hooks';
import { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import _ from 'lodash';

import { useXano, useXanoMethod } from '../helpers/useXano';

export const XanoProvider: React.FC<{ specURL: string }> = ({
  children,
  specURL,
}) => {
  const [{ data }] = useAxios<OpenAPIV3.Document | OpenAPIV3_1.Document>(
    `https://${specURL}?type=json`
  );
  if (!data) return null;

  _.each(data.paths, (path, pathIndex) => {
    if (!path) return;

    const entity = _.startCase(pathIndex.split('/')[1]);
    const by = _.startCase(pathIndex.split('/')[2]);
    const suffix = by ? `By${by}` : '';

    if (path.get) {
      path.get.operationId = 'get' + entity + suffix;
    }
    if (path.post) {
      path.post.operationId = (by ? 'update' : 'add') + entity + suffix;
    }
    if (path.patch) {
      path.patch.operationId = 'patch' + entity + suffix;
    }
    if (path.delete) {
      path.delete.operationId = 'delete' + entity + suffix;
    }
  });

  return <OpenAPIProvider definition={data}>{children}</OpenAPIProvider>;
};

const Xano = {
  Provider: XanoProvider,
  useXano,
  useXanoMethod,
};

export default Xano;
