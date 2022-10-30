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
export type Content = {
    root: string,
    type: Type,
    data: Buffer | Entry[]
}