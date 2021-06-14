export interface CovidResponse {
    died:       BrokenDow;
    infected:   BrokenDow;
    quarantine: number;
    recovered:  BrokenDow;
    sampled:    number;
    vaccinated: number;
}

export interface BrokenDow {
    capital:     number;
    countryside: number;
}
