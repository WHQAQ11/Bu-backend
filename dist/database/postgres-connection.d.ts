import { Pool, PoolClient } from 'pg';
export declare class PostgreSQLDatabase {
    private static instance;
    private pool;
    private constructor();
    static getInstance(): PostgreSQLDatabase;
    getPool(): Pool;
    query(sql: string, params?: any[]): Promise<any>;
    transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T>;
    testConnection(): Promise<boolean>;
    close(): Promise<void>;
    runMigrations(): Promise<void>;
    getDatabaseInfo(): Promise<any>;
}
export declare const db: PostgreSQLDatabase;
//# sourceMappingURL=postgres-connection.d.ts.map