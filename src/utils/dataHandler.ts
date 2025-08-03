export interface UserInputs {
    date: Date;
    odo: number;
    trip: number;
    gallons: number;
    pricePerGal: number;
    notes: string;
}

export interface Entry extends UserInputs {
    id: number;
    cost: number;
    mpg: number;
    cpm: number;
}

export const effCalc = (data: UserInputs) => {
    return {
        cost: data.gallons * data.pricePerGal,
        mpg: data.trip / data.gallons,
        cpm: (data.gallons * data.pricePerGal) / data.trip,
    }
};

export const buildEntry = (input: UserInputs) => {
    // need to figure out how to combine UserInputs with effCalc
    // values and return them into a single log entry
}