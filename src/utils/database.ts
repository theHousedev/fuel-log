import initSqlJs from 'sql.js';
import type { Entry } from './dataHandler.ts';

export class FuelDatabase {
    private db: any;

    async init() {
        const SQL = await initSqlJs({
        });
        this.db = new SQL.Database();
        this.createTables();
    }

    createTables() {
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS entries (
                id INTEGER PRIMARY KEY,
                date TEXT NOT NULL,
                odo INTEGER NOT NULL,
                trip REAL NOT NULL,
                gallons REAL NOT NULL,
                pricePerGal REAL NOT NULL,
                notes TEXT
            )
        `;
        this.db.run(createTableSQL);
    }

    addEntry(entry: Entry) {
        // TODO: complete
    }

    getAllEntries() {
        // TODO: complete
    }
}