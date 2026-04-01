export type JsonEndpointExample = {
  label: string;
  path: string;
};

export type JsonEndpointCapability = {
  label: string;
  detail: string;
};

export type JsonEndpointSource = 'static' | 'api';

export type JsonEndpointCard = {
  name: string;
  path: string;
  description: string;
  source: JsonEndpointSource;
  status?: string;
  nestingPath?: string;
  examples?: JsonEndpointExample[];
  capabilities?: JsonEndpointCapability[];
};
