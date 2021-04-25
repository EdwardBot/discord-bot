export interface CovidResponse {
    infected:            number;
    activeInfected:      number;
    deceased:            number;
    recovered:           number;
    quarantined:         number;
    tested:              number;
    sourceUrl:           string;
    lastUpdatedAtSource: string;
    lastUpdatedAtApify:  string;
    readMe:              string;
}
