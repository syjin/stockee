import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ createRoot 사용
import App from './App';

import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
