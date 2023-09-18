import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import WVI from './WVI';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './tailwind.css'
import './index.css'
import logo from './proraillogo.png';
import Home from './home';



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<Home/>);
