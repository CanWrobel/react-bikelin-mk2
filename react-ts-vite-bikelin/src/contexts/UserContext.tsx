import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext({
  username: null,
  setUsername: () => {},
  token: null,
  setToken: () => {},
});

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);

  return (
    <UserContext.Provider value={{ username, setUsername, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
