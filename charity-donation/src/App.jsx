import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CardDetail from "./pages/cardDetail";
import Payments from "./pages/Payments";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Login />} />
      <Route path="/detail/:id" element={<CardDetail />} />
      <Route path="/payments" element={<Payments />} />
    </Routes>
  </BrowserRouter>
);

export default App;
