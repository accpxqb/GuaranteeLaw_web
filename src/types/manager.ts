export interface Manager {
    Id: number;
    UserName: string;
    PhotoPath: string;
    PhotoName?: string;
    PersonalProfile: string;
    ManagerScoreInfo: ManagerScoreInfo;
    FirstName?: string;
    LastName?: string;
    FullName?: string;
    ManagerScoreJson?: string;
    usersExtends: Array<Object>;
}

export interface ManagerScoreInfo {
    CumulativePersonnel: number;
    EnvironmentalScore: number;
    FacilityScore: number;
    HealthScore: number;
    Id: number;
    ManagerId: number;
    PositiveNumber: number;
    ScoringTimes: number;
    ServiceScore: number;
    TotalScore: number;
    Integral: number;
}