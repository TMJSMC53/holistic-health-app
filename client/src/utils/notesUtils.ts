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

export const getBorderColor = (color: string): string => {
  switch (color) {
    case 'primary-400':
      return 'border-primary-400';
    case 'primary-700':
      return 'border-primary-700';
    case 'accents-400':
      return 'border-accents-400';
    default:
      return 'border-primary-400';
  }
};

export const getHoverBackgroundColor = (color: string): string => {
  switch (color) {
    case 'primary-400':
      return 'hover:bg-primary-400';
    case 'primary-700':
      return 'hover:bg-primary-700';
    case 'accents-400':
      return 'hover:bg-accents-400';
    default:
      return 'hover:bg-primary-400';
  }
};
