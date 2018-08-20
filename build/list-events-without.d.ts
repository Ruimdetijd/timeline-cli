import { MenuAction } from './index';
export default function listEventsWithout(type: 'date' | 'label' | 'location'): Promise<MenuAction | string>;
