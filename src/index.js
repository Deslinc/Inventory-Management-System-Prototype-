import React from 'react';
import ReactDOM from 'react-dom/client';
// If you're not using AG Grid Enterprise features locally, comment out the enterprise import
// to avoid license warnings. If you have a valid license, set it here instead.
// import { LicenseManager } from 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './index.css';
import App from './App';

// LicenseManager.setLicenseKey('YOUR_LICENSE_KEY_HERE');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
