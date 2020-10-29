import { Database, MongoClient } from "https://deno.land/x/mongo@v0.13.0/mod.ts";
import { load } from "https://deno.land/x/denv@2.0.0/mod.ts";

await load(".env");

let db: Database;

export const connect = () => {
    const MONGODB_URI = `mongodb+srv://${Deno.env.get("DB_USER")}:${Deno.env.get(
        "DB_PASS"
    )}@cluster0.ygqkk.mongodb.net/${Deno.env.get(
        "DB_NAME"
    )}?retryWrites=true&w=majority`;

    const client = new MongoClient();
    client.connectWithUri(MONGODB_URI);

    db = client.database(Deno.env.get("DB_NAME") as string);
};

export const getDb = () => {
    return db;
};
