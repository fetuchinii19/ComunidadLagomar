import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { useMemo } from "react";
import { useCollection as useFirebaseCollection } from "react-firebase-hooks/firestore";

export const firebaseConfig = {
  projectId: "studio-5677857860-fb9a8",
    appId: "1:465962809752:web:6d4936061bbfa1051f93ed",
      apiKey: "AIzaSyC2KTIXBNhesiqq-2-XAKfaDKiYIFIA3PQ",
        authDomain: "studio-5677857860-fb9a8.firebaseapp.com",
          measurementId: "",
            messagingSenderId: "465962809752"
            };

            const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
            export const db = getFirestore(app);

            export const useFirestore = () => db;

            export const useCollection = (query: any) => {
              const [values, loading, error] = useFirebaseCollection(query);
                return { 
                    data: values?.docs.map(doc => ({ id: doc.id, ...doc.data() })), 
                        isLoading: loading, 
                            error 
                              };
                              };

                              export const useMemoFirebase = (callback: () => any, deps: any[]) => {
                                return useMemo(callback, deps);
                                };
                                