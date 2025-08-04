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

  const handleDisplayToggle = () => {
    if (!showEntries) {
      updateDisplay();
    }
    setShowEntries(!showEntries);
  }

  /*
   can eventually add in a way to pass arg so the display can be updated
   with some appstate like a date range, for now default: 'display all'
  */
  const updateDisplay = () => {
    if (!database) return;

    const allEntries = database.getAllEntries();
    setEntries(allEntries);
    console.log("Fetched all entries:\n", allEntries);
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

    if (showEntries) {
      updateDisplay();
    }
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

        <button type="submit">Submit Entry</button>

        <label htmlFor="showEntries">Show Entries</label>
        <input type="checkBox"
          name="showEntries"
          onChange={handleDisplayToggle} />

        {showEntries && entries.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr style={{ backgroundColor: '#222222', textAlign: 'center', fontSize: '12pt' }}>
                  <th style={{ border: '1px solid #ccc', padding: '5px' }}><small>Date</small></th>
                  <th style={{ border: '1px solid #ccc', padding: '5px' }}><small>Mileage</small></th>
                  <th style={{ border: '1px solid #ccc', padding: '5px' }}><small>Trip</small></th>
                  <th style={{ border: '1px solid #ccc', padding: '5px' }}><small>Gallons</small></th>
                  <th style={{ border: '1px solid #ccc', padding: '5px' }}><small>$/Gal</small></th>
                  <th style={{ border: '1px solid #ccc', padding: '5px' }}><small>MPG</small></th>
                  <th style={{ border: '1px solid #ccc', padding: '5px' }}><small>$/Mi</small></th>
                  <th style={{ border: '1px solid #ccc', padding: '5px' }}><small>Fillup</small></th>
                </tr>
              </thead>
              <tbody>
                {
                  entries.map((entry) => (
                    <tr key={entry.id} style={{ fontSize: '8pt', textAlign: 'center' }}>
                      <td>{entry.date.toLocaleDateString()}</td>
                      <td>{entry.odo.toFixed(0)}</td>
                      <td>{entry.trip.toFixed(1)}mi</td>
                      <td>{entry.gallons.toFixed(3)}</td>
                      <td>${entry.pricePerGal.toFixed(3)}</td>
                      <td>{entry.mpg.toFixed(1)}</td>
                      <td>${entry.cpm.toFixed(3)}</td>
                      <td>${entry.cost.toFixed(2)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}
      </form >
    </div >
  )
}

export default App