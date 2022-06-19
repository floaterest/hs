import * as path from 'path';
import * as fs from 'fs';


const argv = process.argv[process.argv.length - 1];
const cwd = fs.existsSync(argv) ? argv : process.cwd();

export async function handle({ event, resolve }){
	const { url: { href, pathname } } = event;
	const file = pathname.replace(/\/__data\.json$/, '');
	const referer = event.request.headers.get('referer');
	// append referer
	const target = (referer && !referer.startsWith(href))
		? path.join(cwd, referer.replace(event.url.origin, ''), path.basename(file))
		: path.join(cwd, file);

	const stat = await fs.promises.lstat(target);
	switch(true){
		case stat.isFile():
			return new Response(await fs.promises.readFile(target), {
				headers: {
					'Content-Type': 'text/plain;charset=utf-8',
				}
			});
		case stat.isDirectory():
			const items = await fs.promises.readdir(target);
			if(items.includes('index.html')){
				return new Response(await fs.promises.readFile(path.join(target, 'index.html')), {
					status: 200,
					headers: {
						'Content-Type': 'text/html;charset=utf-8'
					}
				});
			}
			event.locals.root = target;
			event.locals.items = items;
	}
	return await resolve(event);
}