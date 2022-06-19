import * as fs from 'fs';
import * as path from 'path';

export async function get({ locals: { root, items } }){
	if(items){
		const files = [], folders = [];
		for(const item of items){
			const stat = await fs.promises.lstat(path.join(root, item));
			if(stat.isDirectory()){
				folders.push(item);
			}else if(stat.isFile()){
				files.push(item);
			}
		}
		return { status: 200, body: { root, folders, files } };
	}else{
		return { status: 404 };
	}
}