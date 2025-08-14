// withAuth.js
import React from "react";
import { useAuth } from "./Context/AuthContext";

export function withAuth(Component) {
  return function AuthWrapped(props) {
    const { user } = useAuth();

    if (!user) {
      return (
        <div className="text-center py-4">
          <p className="text-red-500 font-bold">
            You must be logged in to see this section.
          </p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
