import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { EnsureKontentAsParent } from "./EnsureKontentAsParent";
import { RuleWriter } from './RuleWriter';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <EnsureKontentAsParent>
      <RuleWriter />
    </EnsureKontentAsParent>
  </React.StrictMode>
);
