import * as fs from 'fs';
import * as path from 'path';

import { Type } from '$lib/types';

export async function get({ locals: { type, root, cwd, content } }){
	switch(type){
		case Type.Folder:
			const files = [], folders = [];
			for(const item of content){
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
				cum: r += '/' + dir // cumulative path
			}));
			return { body: { type, root, cwd, sep, folders, files } };
		case Type.File:
			return { body: { type, root, cwd, content } };
		default:
			// I have no idea what to do here
			return { status: 404 };
	}
}