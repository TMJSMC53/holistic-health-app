export const getBackgroundColor = (color: string): string => {
  switch (color) {
    case 'primary-400':
      return 'bg-primary-400';
    case 'primary-700':
      return 'bg-primary-700';
    case 'accents-400':
      return 'bg-accents-400';
    default:
      return 'bg-primary-400';
  }
};
