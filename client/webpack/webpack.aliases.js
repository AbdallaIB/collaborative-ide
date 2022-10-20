const path = require('path');
/**
 * Export Webpack Aliases
 *
 * Tip: Some text editors will show the errors or invalid intellisense reports
 * based on these webpack aliases, make sure to update `tsconfig.json` file also
 * to match the `paths` we using in here for aliases in project.
 */
module.exports = {
  '@src': path.resolve(__dirname, '../src/'),
  '@assets': path.resolve(__dirname, '../src/assets/'),
  '@components': path.resolve(__dirname, '../src/components/'),
  '@api': path.resolve(__dirname, '../src/api/'),
  '@context': path.resolve(__dirname, '../src/context/'),
  '@services': path.resolve(__dirname, '../src/services/'),
  '@lib': path.resolve(__dirname, '../src/lib/'),
  '@pages': path.resolve(__dirname, '../src/pages/'),
  '@routes': path.resolve(__dirname, '../src/routes/'),
  '@styles': path.resolve(__dirname, '../src/styles/'),
  '@utils': path.resolve(__dirname, '../src/utils/'),
  '@shared': path.resolve(__dirname, '../../server/src/shared/'),
};
