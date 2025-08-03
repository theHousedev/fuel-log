import type { Entry } from './dataHandler.ts'

export const addEntry = (entry: Entry) => {
    const storageKey = 'fuelEntries';

    const existingData = localStorage.getItem(storageKey);
    const entries = JSON.parse(existingData || '[]');

    entries.push(entry);
    localStorage.setItem(storageKey, JSON.stringify(entries));
};

export const fetchEntry = (id: number) => {

};

export const editEntry = (id: number) => {

};