import {
  AxiosResponse,
  OpenAPIClientAxios,
  UnknownOperationMethod,
} from 'openapi-client-axios';
import { useOperation, useOperationMethod } from 'react-openapi-client';

interface XanoResponse {
  loading: boolean;
  error?: Error;
  data?: any;
  response: AxiosResponse;
  api: OpenAPIClientAxios;
}

export const useXano = <T>(
  operationId: string,
  ...params: Parameters<UnknownOperationMethod>
) => {
  const { data, ...rest } = useOperation(operationId, ...params);

  const typedData = data as T;

  return { data: typedData, ...rest };
};

export const useXanoMethod = <T>(
  operationId: string
): [UnknownOperationMethod, XanoResponse] => {
  const [method, { data, ...rest }] = useOperationMethod(operationId);

  const typedData = data as T;

  return [method, { data: typedData, ...rest }];
};
