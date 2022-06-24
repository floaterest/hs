import * as path from 'path';
import * as fs from 'fs';

import { Type } from '$lib/types';

import mime from 'mime';

const argv = path.resolve(process.argv[process.argv.length - 1]);
const root = fs.existsSync(argv) ? argv : process.cwd();

export async function handle({ event, resolve }){
	const pathname = event.url.pathname.replace(/\/__data\.json$/, '');
	const cwd = path.join(root, pathname);
	const stat = await fs.promises.lstat(cwd);
	let content: string | string[];
	// assume not dir => is file
	const type = stat.isDirectory() ? Type.Folder : Type.File;
	switch(type){
		case Type.File:
			const t = mime.getType(cwd);
			content = '' + await fs.promises.readFile(cwd);
			if(t && t !== 'text/plain'){
				return new Response(content, {
					headers: { 'Content-Type': t + ';charset=utf-8', }
				});
			}
			break;
		case Type.Folder:
			content = await fs.promises.readdir(cwd);
			const index = path.join(cwd, 'index.html');
			if(fs.existsSync(index)){
				return new Response(await fs.promises.readFile(index), {
					headers: { 'Content-Type': 'text/html;charset=utf-8' }
				});
			}
			break;
	}
	event.locals = { type, root, cwd, content };
	return await resolve(event);
}