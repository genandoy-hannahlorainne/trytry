import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Photobooth from "./components/Photobooth";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-amber-50">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Photobooth />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;