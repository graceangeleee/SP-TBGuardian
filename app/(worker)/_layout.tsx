import React, { createContext, useContext, useState, ReactNode } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack } from 'expo-router';
import { userType, submissionType } from '../../Constants/Types';
import Palette from '../../Constants/Palette';
import {NavigationContainer} from 'expo-router'

interface WorkerDataContext {
  monitoring: userType[] | null;
  setMonitoring: React.Dispatch<React.SetStateAction<userType[] | null>>;
  done: userType[] | null ;
  setDone: React.Dispatch<React.SetStateAction<userType[] | null>>;
  missing: submissionType[] | null;
  setMissing: React.Dispatch<React.SetStateAction<submissionType[] | null>>;
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
  const [missing, setMissing] = useState<submissionType[] | null>(null);

  return (
    <WorkerDataContext.Provider value={{ monitoring, setMonitoring, done, setDone, missing, setMissing }}>
      {children}
    </WorkerDataContext.Provider>
  );
};

export default function Layout() {
  return (
    <WorkerDataProvider>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} initialParams={{ usertype: "patient" }} />
        {/* <Stack.Screen name="modal" options={{ presentation: 'modal' }} /> */}
        <Stack.Screen name="addpatient" options={{ headerTitle: "Add Patient", headerBackTitle: "Back", headerTintColor: Palette.buttonOrLines }} />
        <Stack.Screen name="patientcardlist" options={{ headerTitle: "Patient List", headerBackTitle: "Back", headerTintColor: Palette.buttonOrLines }} />
        <Stack.Screen name="missinglist" options={{ headerTitle: "Missing Submissions", headerBackTitle: "Back", headerTintColor: Palette.buttonOrLines }} />
        <Stack.Screen name="submissioncardlist" options={{ headerTitle: "Submissions List", headerBackTitle: "Back", headerTintColor: Palette.buttonOrLines }} />
        {/* <Stack.Screen name="submissionbin" options={{ presentation: 'modal' }} /> */}
      </Stack>
    </WorkerDataProvider>
  );
}
