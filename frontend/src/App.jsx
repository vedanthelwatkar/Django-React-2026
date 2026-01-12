import Home from "./Home";
import { Provider } from "react-redux";
import { store } from "./redux/store/index.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login.jsx";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
