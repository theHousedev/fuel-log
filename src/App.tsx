import './App.css'
import React, { useEffect, useState } from 'react'
import { effCalc } from './utils/dataHandler.ts'
import type { UserInputs, Entry } from './utils/dataHandler.ts'
import { FuelDatabase } from './utils/database.ts'

function App() {
  const [database, setDatabase] = useState<FuelDatabase | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showEntries, setShowEntries] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserInputs>({
    date: new Date(),
    odo: 0,
    trip: 0,
    gallons: 0,
    pricePerGal: 0,
    notes: ""
  })

  const handleDisplayAll = () => {
    updateDisplay();
    setShowEntries(!showEntries);
  }

  const updateDisplay = () => {
    if (!database) return;
    /* can eventually pass in a filter object to select a date range, user-added
       span, etc. For now this just updates as if 'display all' option selected */
    if (showEntries) {
      // TODO: make this explicitly the 'display all' branch
      const allEntries = database.getAllEntries();
      setEntries(allEntries);
      console.log("Fetched all entries:\n", allEntries);
    }

  }

  useEffect(() => {
    const initDB = async () => {
      const db = new FuelDatabase();
      await db.init();
      setDatabase(db);
    };
    initDB();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    let finalValue: string | number | Date = value;

    if (name === "odo") {
      finalValue = parseInt(value);
    } else if (["trip", "gallons", "pricePerGal"].includes(name)) {
      finalValue = parseFloat(value);
    } else if (name === "date") {
      finalValue = new Date(value);
    }

    setFormData(prevData => ({ ...prevData, [name]: finalValue }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!database) {
      console.log("Database not ready");
      return;
    }

    const fullEntry: Entry = {
      id: 0,
      ...formData,
      ...eff
    };

    database.addEntry(fullEntry);
    console.log("Entry saved", fullEntry);
    updateDisplay();
  };

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split("T")[0];
  }

  const eff = effCalc(formData);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p><label htmlFor="date">Date: </label>
          <input type="date"
            id="date"
            name="date"
            value={formatDateForInput(formData.date)}
            onChange={handleChange} />
        </p>
        <p><label htmlFor="odo">Odometer: </label>
          <input type="number"
            inputMode="decimal"
            id="odo"
            name="odo"
            value={formData.odo}
            onChange={handleChange} />
        </p>
        <p><label htmlFor="trip">Trip: </label>
          <input type="number"
            inputMode="decimal"
            id="trip"
            name="trip"
            value={formData.trip}
            onChange={handleChange} />
        </p>
        <p><label htmlFor="gallons">Gallons: </label>
          <input type="number"
            inputMode="decimal"
            id="gallons"
            name="gallons"
            value={formData.gallons}
            onChange={handleChange} />
        </p>
        <p><label htmlFor="pricePerGal">Price/gal: </label>
          <input type="number"
            inputMode="decimal"
            id="pricePerGal"
            name="pricePerGal"
            value={formData.pricePerGal}
            onChange={handleChange} />
        </p>
        <p><label htmlFor="notes">Notes: </label>
          <input type="text"
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange} />
        </p>
        <p>{eff.mpg.toFixed(2)} mpg -
          ${eff.cpm.toFixed(3)}/mi -
          ${eff.cost.toFixed(2)} fillup</p>

        <button type="submit">Submit Entry</button><br />

        <label htmlFor="showAll">Show All Entries</label>
        <input type="checkBox"
          name="showAll"
          onChange={handleDisplayAll} />

        {showEntries && entries.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            {entries.map(entry => (
              <div key={entry.id}
                style={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  margin: '5px',
                  fontSize: '10pt'
                }}>
                <strong>{entry.date.toLocaleDateString()}</strong>&nbsp;
                {entry.odo}mi,&nbsp;
                {entry.trip}mi trip,&nbsp;
                {entry.gallons}gal<br />
                ${entry.pricePerGal}/gal,&nbsp;
                {entry.mpg.toFixed(1)}mpg,&nbsp;
                ${entry.cpm.toFixed(3)}/mi,&nbsp;
                ${entry.cost.toFixed(2)} total<br />
                {entry.notes && <small><b>Notes:</b>&nbsp;{entry.notes}</small>}
              </div>
            ))}
          </div>
        )
        }

      </form >
    </div >
  )
}

export default App