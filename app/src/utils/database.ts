import type { Entry } from './dataHandler.ts';

export class FuelDatabase {
    private db: any;

    async init() {
        const initSqlJs = (await import('sql.js')).default;

        const SQL = await initSqlJs({
            locateFile: (file: string) => `https://sql.js.org/dist/${file}`
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
                cost REAL NOT NULL,
                mpg REAL NOT NULL,
                cpm REAL NOT NULL,
                notes TEXT)`;
        this.db.run(createTableSQL);
    }

    addEntry(entry: Entry) {
        const addEntrySQL = `
            INSERT INTO entries (
                date, odo, trip, gallons, pricePerGal,
                cost, mpg, cpm, notes
            ) VALUES (?,?,?,?,?,?,?,?,?)`;
        const vals = [
            entry.date.toISOString().split('T')[0],
            entry.odo, entry.trip, entry.gallons, entry.pricePerGal,
            entry.cost, entry.mpg, entry.cpm, entry.notes
        ];
        this.db.run(addEntrySQL, vals);
    }

    getAllEntries() {
        const query = "SELECT * FROM entries ORDER BY odo DESC";
        const result = this.db.exec(query);
        if (result.length === 0) return [];
        return result[0].values.map((row: any[]) => ({
            id: row[0],
            date: new Date(row[1]),
            odo: row[2],
            trip: row[3],
            gallons: row[4],
            pricePerGal: row[5],
            cost: row[6],
            mpg: row[7],
            cpm: row[8],
            notes: row[9]
        }));
    }
}