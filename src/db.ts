import { createPool, DatabasePoolType } from "slonik";

export class PostgresConnectionPoolSingleton {
  private static instance: DatabasePoolType;
  public getInstance(): DatabasePoolType {
    if (!PostgresConnectionPoolSingleton.instance) {
      PostgresConnectionPoolSingleton.instance = createPool(process.env.POSTGRES_URI || "");
    }

    return PostgresConnectionPoolSingleton.instance;
  }
}
