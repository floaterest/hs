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
		cwd = cwd.replace(root, '').split(path.sep).filter(Boolean);
		return { status: 200, body: { root, cwd, folders, files } };
	}else{
		// I have no idea what to do here
		return { status: 404 };
	}
}