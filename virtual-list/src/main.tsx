import React from 'react';
import ReactDOM from 'react-dom/client';
import VirtualList from './comps/virtualList';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <VirtualList />
  </React.StrictMode>,
);
