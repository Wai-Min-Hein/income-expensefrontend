import { Routes, Route } from "react-router-dom";
import App from "../App";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import PrivateRoute from "./PrivateRoute";
import PublicRoutes from "./PublicRoute";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<App />} />
      </Route>

      <Route element={<PublicRoutes />}>
        <Route path="/login" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
