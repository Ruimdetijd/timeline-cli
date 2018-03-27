export declare const selectOne: (table: any, field: any, value: any) => Promise<any>;
export declare const execSql: (sql: string, values?: (string | number)[]) => Promise<any[]>;
export declare const handleError: (err: any) => void;
