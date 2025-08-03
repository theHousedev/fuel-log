import './App.css'
import React, { useState } from 'react'
import { effCalc } from './utils/dataHandler.ts'
import type { UserInputs, Entry } from './utils/dataHandler.ts'

function App() {
  const [formData, setFormData] = useState<UserInputs>({
    date: new Date(),
    odo: 0,
    trip: 0,
    gallons: 0,
    pricePerGal: 0,
    notes: ""
  })

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
    console.log(formData);
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
        <button type="submit">Confirm Entry</button>
      </form>
    </div >
  )
}

export default App