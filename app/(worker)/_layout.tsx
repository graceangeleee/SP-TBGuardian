import React, { createContext, useContext, useState, ReactNode } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack } from 'expo-router';
import { userType, submissionType } from '../../Constants/Types';
import Palette from '../../Constants/Palette';


interface WorkerDataContext {
  monitoring: userType[] | null;
  setMonitoring: React.Dispatch<React.SetStateAction<userType[] | null>>;
  done: userType[] | null ;
  setDone: React.Dispatch<React.SetStateAction<userType[] | null>>;
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

const WorkerDataContext = createContext<WorkerDataContext | undefined>(undefined);

export const useWorkerData = () => {
  const context = useContext(WorkerDataContext);
  if (!context) {
    throw new Error('useWorkerData must be used within a WorkerDataProvider');
  }
  return context;
};

interface WorkerDataProviderProps {
  children: ReactNode;
}

export const WorkerDataProvider: React.FC<WorkerDataProviderProps> = ({ children }) => {
  const [monitoring, setMonitoring] = useState<userType[] | null>(null);
  const [done, setDone] = useState<userType[] | null>(null);
  const [user, setUser] = useState<userType | null>(null);
  const [userid, setUserID] = useState("");


  return (
    <WorkerDataContext.Provider value={{ monitoring, setMonitoring, done, setDone, user, setUser, userid, setUserID,  }}>
      {children}
    </WorkerDataContext.Provider>
  );
};

export default function Layout() {
  return (
    <WorkerDataProvider>
      <Stack screenOptions={{headerShown: false}}>
        {/* <Stack.Screen name="(drawer)" options={{ headerShown: false }} initialParams={{ usertype: "patient" }} /> */}
        {/* <Stack.Screen name="modal" options={{ presentation: 'modal' }} /> */}
        <Stack.Screen name="addpatient" options={{headerShown: true,  headerTitle: "Add Patient", headerBackTitle: "Back", headerTintColor: Palette.buttonOrLines }} />
        <Stack.Screen name="patientcardlist" options={{ headerShown: true, headerTitle: "Patient List", headerBackTitle: "Back", headerTintColor: Palette.buttonOrLines }} />
        <Stack.Screen name="missinglist" options={{ headerShown: true, headerTitle: "Missing Submissions", headerBackTitle: "Back", headerTintColor: Palette.buttonOrLines }} />
        <Stack.Screen name="submissioncardlist" options={{headerShown: true,  headerTitle: "Submissions List", headerBackTitle: "Back", headerTintColor: Palette.buttonOrLines }} />
        <Stack.Screen name="dailysubmissions" options={{ headerShown: true, headerTitle: "Unverified Submissions", headerBackTitle: "Back", headerTintColor: Palette.buttonOrLines }} />
        <Stack.Screen name="workerschedule" options={{ headerShown: true, headerTitle: "Schedule", headerBackTitle: "Back", headerTintColor: Palette.buttonOrLines }} />
        <Stack.Screen name="submissionpreview" options={{headerShown: true,  headerTitle: "Submission Bin", headerBackTitle: "Back", headerTintColor: Palette.buttonOrLines }} />
        <Stack.Screen name="videoviewer" options={{ headerShown: true, headerTitle: "Playing Video", headerBackTitle: "Back", headerTintColor: Palette.buttonOrLines }} />
        <Stack.Screen name="setschedule" options={{headerShown: true, presentation: 'modal', headerTitle: "Set a Schedule", headerBackTitle: "Back", headerTintColor: Palette.buttonOrLines }} />
        <Stack.Screen name="patientprofile" options={{ headerShown: true, headerTitle: "Patient Profile", headerBackTitle: "Back", headerTintColor: Palette.buttonOrLines }} />
        <Stack.Screen name="editworkerpass" options={{ headerShown: true, headerTitle: "Edit Password", headerBackTitle: "Back", headerTintColor: Palette.buttonOrLines }} />
        <Stack.Screen name="duetoday" options={{ headerShown: true, headerTitle: "Due Today", headerBackTitle: "Back", headerTintColor: Palette.buttonOrLines }} />
        {/* <Stack.Screen name="submissionbin" options={{ presentation: 'modal' }} /> */}
      </Stack>
    </WorkerDataProvider>
  );
}
