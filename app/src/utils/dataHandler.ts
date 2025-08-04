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
    cpm: number; //$/mi
}

export const effCalc = (data: UserInputs) => {
    const hasValidData = data.trip > 0 && data.gallons > 0;

    return {
        cost: data.gallons * data.pricePerGal,
        mpg: hasValidData ? data.trip / data.gallons : 0,
        cpm: hasValidData ? (data.gallons * data.pricePerGal) / data.trip : 0,
    }
};

export const buildEntry = (input: UserInputs) => {
    return input;
}