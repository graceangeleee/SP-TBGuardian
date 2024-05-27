import React, { createContext, useContext, useState, ReactNode } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, Stack } from 'expo-router';
import { userType, submissionType } from '../../Constants/Types';
import { Session } from '@supabase/supabase-js';

// interface UserDataContext {
//   userid: string;
//   setUserID: React.Dispatch<React.SetStateAction<string>>;
//   user: userType | null;
//   setUser: React.Dispatch<React.SetStateAction<userType | null>>;
//   pending: submissionType[];
//   setPending:React.Dispatch<React.SetStateAction<submissionType[]>>;
//   session: Session | null;
//   setSession:React.Dispatch<React.SetStateAction<Session | null>>;
// }

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

// const UserDataContext = createContext<UserDataContext | undefined>(undefined);

// export const useUserData = () => {
//   const context = useContext(UserDataContext);
//   if (!context) {
//     throw new Error('useUserData must be used within a WorkerDataProvider');
//   }
//   return context;
// };

// interface WorkerDataProviderProps {
//   children: ReactNode;
// }

// export const UserDataProvider: React.FC<WorkerDataProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<userType | null>(null);
//   const [userid, setUserID] = useState("");
//   const [pending, setPending] = useState<submissionType[] >([])
//   const [session, setSession] = useState<Session | null>(null)
// ;
//   return (
//     <UserDataContext.Provider value={{ userid, setUserID, user, setUser, pending, setPending, session, setSession }}>
//       {children}
//     </UserDataContext.Provider>
//   );
// };

export default function Layout() {
  

  return (
    
       <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="admin_addworker" options={{headerShown: true, headerBackTitle:"Back", headerTitle: "Add a Worker"}}/>
        <Stack.Screen name="admin_addpatient" options={{headerShown: true, headerBackTitle:"Back", headerTitle: "Add a Patient"}}/>
        <Stack.Screen name="admin_patients" options={{headerShown: true, headerBackTitle:"Back", headerTitle: "Monitored Patients"}}/>
        <Stack.Screen name="admin_workers" options={{headerShown: true, headerBackTitle:"Back", headerTitle: "Registered Workers"}}/>
        <Stack.Screen name="admin_workerprofile" options={{headerShown: true, headerBackTitle:"Back", headerTitle: "Worker's Profile"}}/>
        <Stack.Screen name="admin_patientprofile" options={{headerShown: true, headerBackTitle:"Back", headerTitle: "Patient's Profile"}}/>
        <Stack.Screen name="admin_missing" options={{headerShown: true, headerBackTitle:"Back", headerTitle: "Missing Submissions"}}/>
        <Stack.Screen name="admin_duetoday" options={{headerShown: true, headerBackTitle:"Back", headerTitle: "Missing Submissions"}}/>
        <Stack.Screen name="admin_agenda" options={{headerShown: true, headerBackTitle:"Back", headerTitle: "Sputum Schedule"}}/>
      </Stack>
   
  );
}
