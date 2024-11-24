import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/signup";
import Signin from "./components/signin";
import { SnackbarProvider } from "./components/snackbar";
import MainPage from "./components/dashboard/mainpage";

function App() {
  return (
    <SnackbarProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<MainPage />} />
      </Routes>
    </Router>
    </SnackbarProvider>
  );
}

export default App;
