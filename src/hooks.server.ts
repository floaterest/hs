import { join, resolve, sep } from 'path';
import type { Handle } from '@sveltejs/kit';
import * as fs from 'fs/promises';
import type { AccCur, Entry, Locals } from '$lib/type';
import { Type } from '$lib/type';

/// root without trailing slash
const root = (await (async(r: string) => await stat(r) ? r : process.cwd())(
    resolve(process.argv[process.argv.length - 1])
)).replace(/\/+$/, '');

const file = async(path: string) => new Response(await fs.readFile(path));

async function stat(path: string): Promise<Type>{
    /// returns entry type of path
    const st = await fs.stat(path).catch(_ => null);
    if(st && st.isFile()) return Type.File;
    if(st && st.isDirectory()) return Type.Folder;
    return Type.DNE;
}

function sort(lhs: Entry, rhs: Entry): number{
    /// sort entries (folder first)
    if(lhs.type == rhs.type){
        return lhs.path.localeCompare(rhs.path);
    }else{
        return lhs.type == Type.Folder ? -1 : 1;
    }
}

const readdir = async(path: string) => (await Promise.all(
    (await fs.readdir(path)).map(async(p: string) => ({
        path: p, type: await stat(join(path, p))
    }))
)).sort(sort) as Entry[];

export const handle: Handle = async({ event, resolve }) => {
    const { url: { pathname } } = event;
    const path = decodeURIComponent(join(root, pathname));
    const type = await stat(path);
    switch(type){
        case Type.File:
            return file(path);
        case Type.Folder:
            const index = join(path, 'index.html');
            if(await stat(index) == Type.File){
                return file(index);
            }
            const data = await readdir(path);
            const reduce = (arr: AccCur[], acc: string, cur: string) => ({
                arr: [...arr, { acc, cur }], acc
            });
            const cwd = pathname.split(sep).filter(Boolean).reduce(
                ({ arr, acc }, cur) => reduce(arr, join(acc, cur), sep + cur),
                { arr: [{ acc: '/', cur: root }] as AccCur[], acc: '/' }
            ).arr;
            const locals = { type, data, cwd, root } as Locals;
            return resolve(Object.assign(event, { locals }));
    }
    return resolve(event);
};
