export type Language = 'id' | 'en';

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'id', label: 'Indonesian' },
  { code: 'en', label: 'English' },
];

export const DEFAULT_LANGUAGE: Language = 'id';
