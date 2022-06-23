import * as path from 'path';
import * as fs from 'fs';

import mime from 'mime';

const argv = path.resolve(process.argv[process.argv.length - 1]);
const root = fs.existsSync(argv) ? argv : process.cwd();

export async function handle({ event, resolve }){
	const pathname = event.url.pathname.replace(/\/__data\.json$/, '');
	const cwd = path.join(root, pathname);
	const stat = await fs.promises.lstat(cwd);
	switch(true){
		case stat.isFile():
			return new Response(await fs.promises.readFile(cwd), {
				headers: { 'Content-Type': mime.getType(cwd) + ';charset=utf-8', }
			});
		case stat.isDirectory():
			const items = await fs.promises.readdir(cwd);
			if(items.includes('index.html')){
				return new Response(await fs.promises.readFile(path.join(cwd, 'index.html')), {
					status: 200,
					headers: {
						'Content-Type': 'text/html;charset=utf-8'
					}
				});
			}
			event.locals = { root, cwd, items };
	}
	return await resolve(event);
}