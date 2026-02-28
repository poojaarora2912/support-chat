/* global chrome */
import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import store from './redux/store'
import { selectActivatedTab } from './redux/actions/selection'
import setupAuthInterceptor from './services/auth.interceptor'

setupAuthInterceptor()

if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'CLOSE_PANEL') {
      window.close()
    }
    if (message.type === 'ACTIVATED_TAB' && message.payload) {
      console.log('ACTIVATED_TAB', message.payload)
      store.dispatch(selectActivatedTab(message.payload))
    }
  })
}

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
class ErrorBoundary extends Component {
  state = { hasError: false, error: null }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('App error:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, fontFamily: 'sans-serif' }}>
          <h1>Something went wrong</h1>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {this.state.error?.message || String(this.state.error)}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

const rootEl = document.getElementById('root')
if (!rootEl) {
  document.body.innerHTML = '<p>Root element #root not found.</p>'
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    </StrictMode>,
  )
}
