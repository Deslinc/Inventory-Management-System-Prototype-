import React from 'react';
import ReactDOM from 'react-dom/client';
import { LicenseManager } from 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './index.css';
import App from './App';

// Replace with your AG Grid Enterprise license key
// Get one at: https://www.ag-grid.com/license-pricing/
LicenseManager.setLicenseKey('YOUR_LICENSE_KEY_HERE');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
