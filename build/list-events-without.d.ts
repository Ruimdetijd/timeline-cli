import { MenuAction } from './index';
export declare type EventListType = 'date' | 'label' | 'location' | 'image';
export default function listEventsWithout(type: EventListType): Promise<MenuAction | string>;
