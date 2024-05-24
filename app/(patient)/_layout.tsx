import React, { createContext, useContext, useState, ReactNode } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, Stack } from 'expo-router';
import { userType, submissionType } from '../../Constants/Types';
import { Session } from '@supabase/supabase-js';

interface UserDataContext {
  userid: string;
  setUserID: React.Dispatch<React.SetStateAction<string>>;
  user: userType | null;
  setUser: React.Dispatch<React.SetStateAction<userType | null>>;
  pending: submissionType[];
  setPending:React.Dispatch<React.SetStateAction<submissionType[]>>;
  session: Session | null;
  setSession:React.Dispatch<React.SetStateAction<Session | null>>;
}

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const UserDataContext = createContext<UserDataContext | undefined>(undefined);

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a WorkerDataProvider');
  }
  return context;
};

interface WorkerDataProviderProps {
  children: ReactNode;
}

export const UserDataProvider: React.FC<WorkerDataProviderProps> = ({ children }) => {
  const [user, setUser] = useState<userType | null>(null);
  const [userid, setUserID] = useState("");
  const [pending, setPending] = useState<submissionType[] >([])
  const [session, setSession] = useState<Session | null>(null)
;
  return (
    <UserDataContext.Provider value={{ userid, setUserID, user, setUser, pending, setPending, session, setSession }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default function Layout() {
  

  return (
    <UserDataProvider>
       <Stack screenOptions={{headerShown: false}}>
        {/* <Stack.Screen name="(drawer)" options={{headerShown: false}} initialParams={{usertype: "patient"}} /> */}
        {/* <Stack.Screen name="modal" options={{ presentation: 'modal' }} /> */}
        {/* <Stack.Screen name="addpatient" options={{headerTitle: "Add Patient", headerBackTitle: "Back", headerTintColor: Palette.buttonOrLines}}/> */}
        <Stack.Screen name="submissionbin" options={{headerShown: true, headerBackTitle:"Back", headerTitle: "Submission Bin"}}/>
        <Stack.Screen name="schedule" options={{headerShown: true, headerBackTitle:"Back", headerTitle: "Calendar"}}/>
        <Stack.Screen name="recordvideo" options={{headerShown: true, headerBackTitle:"Back", headerTitle: "Record Video"}}/>
        <Stack.Screen name="changepassword" options={{headerShown: true, headerBackTitle:"Back", headerTitle: "Change Password"}}/>
        <Stack.Screen name="missingsubmissions" options={{headerShown: true, headerBackTitle:"Back", headerTitle: "Missing Submissions"}}/>
        <Stack.Screen name="choosevideo" options={{headerShown: true, headerBackTitle:"Back", headerTitle: "Choose Video"}}/>
        <Stack.Screen name="history" options={{headerShown: true, headerBackTitle:"Back", headerTitle: "History"}}/>
      </Stack>
    </UserDataProvider>
  );
}
