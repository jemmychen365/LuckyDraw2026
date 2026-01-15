export interface Participant {
  id: string;
  name: string;
}

export interface Group {
  id: number;
  members: Participant[];
}

export type Tab = 'input' | 'lottery' | 'grouping';

export interface LotterySettings {
  allowRepeats: boolean;
}

export interface GroupingSettings {
  groupSize: number;
}
