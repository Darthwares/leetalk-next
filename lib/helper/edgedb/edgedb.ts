import { createClient } from "edgedb";

const client = createClient({
  instanceName: process.env.EDGEDB_INSTANCE!,
  secretKey: process.env.EDGEDB_SECRET_KEY!,
});

export default client;
