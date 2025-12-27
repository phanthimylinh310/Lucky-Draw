
export interface Participant {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  members: Participant[];
}

export enum AppTab {
  LIST = 'LIST',
  LUCKY_DRAW = 'LUCKY_DRAW',
  GROUPING = 'GROUPING'
}
