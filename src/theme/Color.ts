
export interface Colors {
  scheme: 'light' | 'dark';
  background: string;
  card: string;
  primary: string;
  lavender: string;
  lime: string;
  text: string;
  muted: string;
  track: string;
}

export const lightColors: Colors = {
  scheme: 'light',
  background: '#F7F6FF',
  card: '#FFFFFF',
  primary: '#6F4BF2',
  lavender: '#A38DF2',
  lime: '#CDFF7E',
  text: '#171326',
  muted: '#777092',
  track: '#E8E3F5',
};

export const darkColors: Colors = {
  scheme: 'dark',
  background: '#0E0B1F',
  card: '#241C40',
  primary: '#6F4BF2',
  lavender: '#A38DF2',
  lime: '#CDFF7E',
  text: '#F7F5FF',
  muted: '#A7A0C3',
  track: '#44395E',
};
