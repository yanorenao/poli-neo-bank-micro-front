import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BalanceActions, ContactsActions } from './flux/ActionCreators'

// Initialize Flux store by fetching initial data
// In Flux, we dispatch actions to load data instead of using providers
BalanceActions.fetchBalance()
ContactsActions.fetchContacts()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
