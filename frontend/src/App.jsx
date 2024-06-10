import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import HomeScreen from "./views/HomeScreen";
import PlayScreen from "./views/PlayScreen";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<HomeScreen />}
        ></Route>
        <Route
          path="/play"
          element={<PlayScreen />}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
