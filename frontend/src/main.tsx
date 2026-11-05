import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';
import { Language } from './contexts/language-context';
import { Theme } from './contexts/theme-context';
import { store } from './redux';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <Language>
      <Theme>
        <App />
      </Theme>
    </Language>
  </Provider>,
);
