export enum Type{
    /// conforms to Material Icons
    DNE = '',
    File = 'insert_drive_file',
    Folder = 'folder',
}

export type Entry = {
    path: string,
    type: Type,
}

/// cumulative current working directory
export type AccCur = { acc: string, cur: string }

export type Locals = {
    type: Type,
    data: Entry[]
    cwd: AccCur[],
}