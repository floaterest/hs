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
	let content: Buffer | any[];
	// assume not dir => is file
	const type = stat.isDirectory() ? Type.Folder : Type.File;
	switch(type){
		case Type.File:
			const ty = mime.getType(cwd);
			content = await fs.promises.readFile(cwd);
			if(ty && !ty.startsWith('text')){
				return new Response(content, {
					headers: { 'Content-Type': ty + ';charset=utf-8', }
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
			}else{
				content = content.map(file => ({
					path: file,
					type: (mime.getType(path.join(cwd, file)) || '').split('/')[0]
				}));
			}
			break;
	}
	event.locals = { type, root, cwd, content };
	return await resolve(event);
}