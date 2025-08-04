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
            tabIndex={0}
            value={formatDateForInput(formData.date)}
            onChange={handleChange} />
        </p>
        <p><label htmlFor="odo">Odometer: </label>
          <input type="number"
            inputMode="decimal"
            id="odo"
            name="odo"
            tabIndex={1}
            value={formData.odo}
            onChange={handleChange} />
        </p>
        <p><label htmlFor="trip">Trip: </label>
          <input type="number"
            inputMode="decimal"
            id="trip"
            name="trip"
            tabIndex={2}
            value={formData.trip}
            onChange={handleChange} />
        </p>
        <p><label htmlFor="gallons">Gallons: </label>
          <input type="number"
            inputMode="decimal"
            id="gallons"
            name="gallons"
            tabIndex={3}
            value={formData.gallons}
            onChange={handleChange} />
        </p>
        <p><label htmlFor="pricePerGal">Price/gal: </label>
          <input type="number"
            inputMode="decimal"
            id="pricePerGal"
            name="pricePerGal"
            tabIndex={4}
            value={formData.pricePerGal}
            onChange={handleChange} />
        </p>
        <p><label htmlFor="notes">Notes: </label>
          <input type="text"
            id="notes"
            name="notes"
            tabIndex={5}
            value={formData.notes}
            onChange={handleChange} />
        </p>
        <p style={{ fontSize: '8pt', textAlign: 'center' }}>
          {eff.mpg.toFixed(2)} mpg -
          ${eff.cpm.toFixed(3)}/mi -
          ${eff.cost.toFixed(2)} fillup</p>

        <div className="controls-container">
          <div className="checkBoxWrapper">
            <label htmlFor="showEntries" style={{ fontSize: '8pt', marginRight: '10px' }}>Show Entries</label>
            <input type="checkBox"
              style={{ boxSizing: 'border-box' }}
              name="showEntries"
              checked={showEntries}
              onChange={handleDisplayToggle} />
          </div>
          <button className="submit-button"
            type="submit">Submit Entry</button>
        </div>

        {showEntries && entries.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <table className="entry-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>mi</th>
                  <th>Trip</th>
                  <th>G</th>
                  <th>$/G</th>
                  <th>mpg</th>
                  <th>$/mi</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {
                  entries.map((entry) => (
                    <tr key={entry.id}>
                      <td className="dateVal">
                        {entry.date.toLocaleDateString()}</td>
                      <td>{entry.odo.toFixed(0)}</td>
                      <td>{entry.trip.toFixed(1)}mi</td>
                      <td>{entry.gallons.toFixed(3)}</td>
                      <td>${entry.pricePerGal.toFixed(3)}</td>
                      <td className="computedVal">{entry.mpg.toFixed(1)}</td>
                      <td className="computedVal">${entry.cpm.toFixed(3)}</td>
                      <td className="computedVal">${entry.cost.toFixed(2)}</td>
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