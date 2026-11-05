import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';
import { Theme } from './contexts/theme-context';
import { store } from './redux';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <Theme>
      <App />
    </Theme>
  </Provider>,
);
