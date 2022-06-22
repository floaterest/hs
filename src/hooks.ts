import * as path from 'path';
import * as fs from 'fs';


const argv = path.resolve(process.argv[process.argv.length - 1]);
const root = fs.existsSync(argv) ? argv : process.cwd();

function split(http: string | null): string{
	return http ? '/' + http.split('/').slice(3).join('/') : '';
}

export async function handle({ event, resolve }){
	const pathname = event.url.pathname.replace(/\/__data\.json$/, '');
	const referer = split(event.request.headers.get('referer'));
	const rel = path.relative(referer, pathname);
	// if the path goes up and down (can only be done by external .html files)
	const cwd = rel.startsWith('..') && rel.split(path.sep).some(p => p !== '..')
		? path.join(root, referer, pathname)
		: path.join(root, pathname);

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