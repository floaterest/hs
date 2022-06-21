import * as path from 'path';
import * as fs from 'fs';


const argv = path.resolve(process.argv[process.argv.length - 1]);
const root = fs.existsSync(argv) ? argv : process.cwd();

export async function handle({ event, resolve }){
	const { url: { href, pathname } } = event;
	const file = pathname.replace(/\/__data\.json$/, '');
	const referer = event.request.headers.get('referer');
	// append referer
	const cwd = (referer && !referer.startsWith(href))
		? path.join(root, referer.replace(event.url.origin, ''), path.basename(file))
		: path.join(root, file.replace(/\/$/, ''));
	const stat = await fs.promises.lstat(cwd);
	switch(true){
		case stat.isFile():
			return new Response(await fs.promises.readFile(cwd), {
				headers: {
					'Content-Type': 'text/plain;charset=utf-8',
				}
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