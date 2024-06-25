import { CodegenConfig } from "@graphql-codegen/cli";
require('dotenv').config({ path: '.env.development' });

const config: CodegenConfig = {
  schema: `${process.env.NEXT_PUBLIC_URL_SERVER}graphql`,
  documents: ["src/**/*.tsx"],
  generates: {
    "./src/__generated__/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
