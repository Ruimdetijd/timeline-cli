// import { confirm } from './readline'
// import searchEntity from "./search-wikidata/search-entity";
// import { MenuAction } from '.';
// import { WdEntity } from './models';
// import { execPost } from './utils';
// import { civslogServerURL } from './constants';

// export default async function main(): Promise<string> {
// 	const selection = await searchEntity()
// 	if (selection == null) return

// 	if (selection in MenuAction) return selection as MenuAction

// 	const entity = selection as WdEntity

// 	const confirmed = await confirm(`Is this correct?\n${entity.id}, ${entity.label}, ${entity.description}\n(yes)\n`)
// 	if (confirmed) await execPost(`${civslogServerURL}/tags`, entity)
// }
