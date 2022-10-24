const colors = [
  '#9d6862',
  '#9d6b62',
  '#9d6f62',
  '#9d7362',
  '#9d7762',
  '#9d7a62',
  '#9d7e62',
  '#9d8162',
  '#9d8662',
  '#9d8f62',
  '#9d9562',
  '#9d9d62',
  '#959d62',
  '#8f9d62',
  '#889d62',
  '#809d62',
  '#779d62',
  '#6d9d62',
  '#629d62',
  '#629d6e',
  '#629d77',
  '#629d80',
  '#629d89',
  '#629d94',
  '#629d9d',
  '#62939d',
  '#62899d',
  '#627f9d',
  '#62769d',
  '#626c9d',
  '#62629d',
  '#6c629d',
  '#76629d',
  '#80629d',
  '#89629d',
  '#94629d',
  '#9d629d',
  '#9d6293',
  '#9d6289',
  '#9d6280',
  '#9d6276',
];

export const generateColor = (currentColors: string[]): string => {
  let randomColor = colors[Math.floor(Math.random() * colors.length)];
  do {
    randomColor = colors[Math.floor(Math.random() * colors.length)];
  } while (currentColors.indexOf(randomColor) !== -1);
  return randomColor;
};
