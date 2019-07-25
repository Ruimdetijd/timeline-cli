export declare type Action = 'insert' | 'update' | 'image';
export default function bulkUpdate(IDs: string[], action?: Action): Promise<void>;
