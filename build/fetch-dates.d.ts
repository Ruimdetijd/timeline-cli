import { WdDate } from "./models";
import { EventType } from "./event";
export declare const setUTCDate: (year: number, month?: number, day?: number, hour?: number, minutes?: number, seconds?: number, milliseconds?: number) => number;
declare const _default: (eventType: EventType, wdEntityID: string) => Promise<[WdDate, WdDate, WdDate, WdDate]>;
export default _default;
