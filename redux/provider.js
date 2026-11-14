"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { setCredentials } from "./slices/authSlice";

function SessionHydrator({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    async function hydrateUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user && isMounted) {
            dispatch(
              setCredentials({
                id: data.user.id,
                email: data.user.email,
                name: data.user.fullName,
                role: data.user.role,
                avatarUrl: data.user.avatarUrl,
              })
            );
          }
        }
      } catch (err) {
        // Silent fail on network error or offline mode
      }
    }

    hydrateUser();
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return children;
}

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <SessionHydrator>{children}</SessionHydrator>
    </Provider>
  );
}
