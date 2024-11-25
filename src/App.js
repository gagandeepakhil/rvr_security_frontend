import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/signup";
import Signin from "./components/signin";
import { SnackbarProvider } from "./components/snackbar";
import MainPage from "./components/dashboard/mainpage";
import { PopperProvider } from './components/poppercontext';

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
