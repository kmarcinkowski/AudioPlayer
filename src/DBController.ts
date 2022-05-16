import Dexie, { Table } from "dexie";

export interface Playlist {
    id?: number;
    name: string;
    tracks: any[];
}

export class MyDB extends Dexie {
    playlists!: Table<Playlist>;

    constructor() {
        super("AudioPlaylist");
        this.version(1).stores({
            playlists: "++id, name, tracks", // Primary key and indexed props
        });
    }
}

export const db = new MyDB();
