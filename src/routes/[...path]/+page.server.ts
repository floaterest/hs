import type { PageServerLoad } from './$types';

import { join, resolve } from 'path';
import * as fs from 'fs/promises';
import type { Content, Entry } from '$lib/type';
import { Type } from '$lib/type';
import * as mime from 'mime/lite';

mime.define({ 'text/plain': ['ts'] }, true);


async function stat(path: string): Promise<Type>{
    /// returns entry type of path
    const st = await fs.stat(path).catch(_ => null);
    if(st && st.isFile()) return Type.File;
    if(st && st.isDirectory()) return Type.Folder;
    return Type.DNE;
}

function sort(lhs: Entry, rhs: Entry): number{
    /// sort entries (folder first)
    if(lhs.type === Type.Folder && rhs.type === Type.File){
        return -1;
    }
    return lhs.path.localeCompare(rhs.path);
}

const root = await (async(r: string) => await stat(r) ? r : process.cwd())(
    resolve(process.argv[process.argv.length - 1])
);

const respond = async(path: string, type: string) => new Response(
    await fs.readFile(path),
    { headers: { 'Content-Type': type + ';charset=utf-8' } }
);


export const load: PageServerLoad = async({ url }) => {
    const { pathname } = url;
    const path = decodeURIComponent(join(root, pathname));
    const type = await stat(path);
    let data;
    switch(type){
        case Type.File:
            const ty = mime.getType(path)!;
            if(!ty || ty === 'text/html' || !ty.startsWith('text')){
                return await respond(path, ty);
            }
            data = await fs.readFile(path);
            break;
        case Type.Folder:
            const index = join(path, 'index.html');
            if(await stat(index)){
                return await respond(index, 'text/html');
            }
            const map = async(path: string) => ({
                path, type: await stat(join(root, pathname, path))
            }) as Entry;
            data = (await Promise.all((await fs.readdir(path)).map(map))).sort(sort);
            break;
    }
    return { root, path, type, data } as Content;
};