import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/signup/signup";
import Signin from "./components/signin/signin";
import { SnackbarProvider } from "./components/snackbar";
import MainPage from "./components/dashboard/mainpage";
import { PopperProvider } from './components/poppercontext';
import "./App.css"

function App() {
  return (
    <SnackbarProvider>
      <PopperProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<MainPage />} />
      </Routes>
    </Router> 
    </PopperProvider>
    </SnackbarProvider>
  );
}

export default App;
