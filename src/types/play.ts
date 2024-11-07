
export interface ResponsePlay {
    Id: number;
    PlayAmenitys: string;
    PlayDetails: string;
    PlayIntroduction: string;
    PlayItems: string;
    PlayName: string;
    TotalPrice: number;
    PicList: [];
}

export interface PlayDetail {
    Name: string;
    Number: string;
    Price: number | undefined;
    Notes: string;
}

/**
 * @PlayId: 等于ID 用于绑定select
 */
export interface Play {
    Id?: number;
    PlayId?: number;//等于ID，用于绑定select
    PlayName: string;
    PicList: string[];
    PlayDetails: PlayDetail[];
    PlayIntroduction: string;
    PlayItems: string[];
    PlayAmenitys: string[];
    TotalPrice: number;
}

export interface PlayProperty extends Play {
    PlayId?: number;
    IsModification?: number;
    ModificationNotes?: string;
    BeginTime?: Date;
    EndTime?: Date;
    TimeRange?: [beginTime: Date, endTime: Date];
}