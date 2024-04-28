import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, Stack } from 'expo-router';
import { Pressable } from 'react-native';
import Colors from '../../Constants/Colors';
// import { useColorScheme } from '@/components/useColorScheme';
// import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import Palette from '../../Constants/Palette';
import { useColorScheme } from 'react-native';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function Layout() {
  

  return (
    <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false}} initialParams={{usertype: "patient"}} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="addpatient" options={{headerTitle: "Add Patient", headerBackTitle: "Back", headerTintColor: Palette.buttonOrLines}}/>
        <Stack.Screen name="submissionbin" options={{presentation: 'modal'}}/>
      </Stack>
  );
}
