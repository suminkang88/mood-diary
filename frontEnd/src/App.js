import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Emoticon from "./pages/Emoticon";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/emoticon" element={<Emoticon />} />
      </Routes>
    </Router>
  );
}

export default App;
