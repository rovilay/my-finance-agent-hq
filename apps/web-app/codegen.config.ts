import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../backend-api/src/gql/schema.gql',
  documents: ['src/**/*.{ts,tsx}', 'src/lib/graphql/**/*.graphql'],
  generates: {
    './src/lib/graphql/generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
