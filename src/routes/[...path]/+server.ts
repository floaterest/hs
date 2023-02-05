import type { RequestHandler } from './$types';
import consumers from 'stream/consumers';
import fs from 'fs/promises';
import path from 'path';

export const POST: RequestHandler = async ({ request, url: { pathname } }) => {
    const { body, headers } = request;
    const root = headers.get('root')!;
    const name = headers.get('name')!;
    const data = await consumers.buffer(body);
    console.log('write', path.join(root, pathname, name))
    await fs.writeFile(path.join(root, pathname, name), data);
    return new Response();
};
