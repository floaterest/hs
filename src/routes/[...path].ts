import * as fs from 'fs';
import * as path from 'path';

export async function get({ locals: { root, cwd, items } }){
	if(items){
		const files = [], folders = [];
		for(const item of items){
			const stat = await fs.promises.lstat(path.join(cwd, item));
			if(stat.isDirectory()){
				folders.push(item);
			}else if(stat.isFile()){
				files.push(item);
			}
		}
		const sep = path.sep;
		let r = '';
		cwd = cwd.replace(root, '').split(sep).filter(Boolean).map(dir => ({
			dir,
			cum: r += '/' + dir
		}));
		return { status: 200, body: { root, cwd, sep, folders, files } };
	}else{
		// I have no idea what to do here
		return { status: 404 };
	}
}