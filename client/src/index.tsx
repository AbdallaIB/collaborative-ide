import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from '@styles/shared/theme';
import GlobalStyle from '@styles/shared/global';
import App from './App';
import './index.css';

const container = document.getElementById('root')!;
render(
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <Router>
      <App />
    </Router>
  </ThemeProvider>,
  container,
);
