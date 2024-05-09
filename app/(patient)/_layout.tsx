import React, { createContext, useContext, useState, ReactNode } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, Stack } from 'expo-router';
import { userType } from '../../Constants/Types';

interface UserDataContext {
  userid: string;
  setUserID: React.Dispatch<React.SetStateAction<string>>;
  user: userType | null;
  setUser: React.Dispatch<React.SetStateAction<userType | null>>;
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

  return (
    <UserDataContext.Provider value={{ userid, setUserID, user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default function Layout() {
  

  return (
    <UserDataProvider>
      <Stack>
        <Stack.Screen name="(drawer)" options={{headerShown: false}} initialParams={{usertype: "patient"}} />
        {/* <Stack.Screen name="modal" options={{ presentation: 'modal' }} /> */}
        {/* <Stack.Screen name="addpatient" options={{headerTitle: "Add Patient", headerBackTitle: "Back", headerTintColor: Palette.buttonOrLines}}/> */}
        <Stack.Screen name="submissionbin" options={{headerBackTitle:"Back", headerTitle: "Submission Bin"}}/>
        <Stack.Screen name="schedule" options={{headerBackTitle:"Back", headerTitle: "Calendar"}}/>
      </Stack>
    </UserDataProvider>
  );
}
