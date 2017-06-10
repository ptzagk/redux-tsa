export interface State {
    notes: string[];
    amounts: number[];
    [key: string]: any;
}

const state: State = {
    notes: ["less is more when more is too much"],
    amounts: []
};

export default state;
