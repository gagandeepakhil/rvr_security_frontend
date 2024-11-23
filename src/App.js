import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/signup";
import Signin from "./components/signin";
import { SnackbarProvider } from "./components/snackbar";

function App() {
  return (
    <SnackbarProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </Router>
    </SnackbarProvider>
  );
}

export default App;
