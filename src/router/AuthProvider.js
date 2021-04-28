import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
// import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            if(email&&password){
              await auth().signInWithEmailAndPassword(email, password);
            }else{
              alert('Email dan password tidak boleh kosong');
              return false;
            }

            // await auth().signInWithEmailAndPassword(email, password);
          } catch (e) {
            alert(e);
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.error(e);
          }
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
