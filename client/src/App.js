import { Route, Switch } from "react-router-dom";
import './App.css';
import Home from "./components/Home";
import AuthRoute from "./components/AuthRoute";
import UserDashBoard from "./components/UserDashBoard";
import AdminDashBoard from "./components/AdminDashBoard";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUpRequests from "./components/SignupRequests";

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/auth/user" component={AuthRoute} />
      <ProtectedRoute exact path="/dashboard/user" component={UserDashBoard} />
      <ProtectedRoute exact path="/dashboard/admin" component={AdminDashBoard} />
      <ProtectedRoute exact path="/dashboard/admin/signup-requests/" component={SignUpRequests} />
    </Switch>
  );
}

export default App;
