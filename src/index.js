import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';



function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<App />} />

      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<Index />, document.getElementById('root'));