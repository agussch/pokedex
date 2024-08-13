import Landing from "./pages/Landing";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Notfound from "./pages/not-found/Notfound";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="" element={<Landing/>} />
          <Route path="*" element={<Notfound/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;