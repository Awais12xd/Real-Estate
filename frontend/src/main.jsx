import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { store , persistor  } from './app/store.js'
import { Provider} from 'react-redux'
import App from './App.jsx'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor} >
      <App />
      </PersistGate>
    </Provider>,
)
