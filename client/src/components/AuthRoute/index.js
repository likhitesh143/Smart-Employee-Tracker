import React, { useState } from "react";
import Login from "../Login";
import Signup from "../Signup";
import ForgotPassword from "../ForgotPassword";
import './index.css';

const AuthRoute = () => {
   const [authType, setAuthType] = useState('login');

   const renderAuthComponent = () => {
       switch (authType) {
           case 'login':
               return <Login setAuthType={setAuthType} />;
           case 'signup':
               return <Signup setAuthType={setAuthType} />;
           case 'forgot-password':
               return <ForgotPassword setAuthType={setAuthType} />;
           default:
               return <Login setAuthType={setAuthType} />;
       }
   }
    
   return (
    <div className="auth-container">
        {renderAuthComponent()}
    </div>
   )
   
}

export default AuthRoute;