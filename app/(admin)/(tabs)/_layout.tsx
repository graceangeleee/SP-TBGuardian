import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { 
    Entypo 
} from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import Palette from '../../../Constants/Palette';
import { Pressable } from 'react-native';
import { supabase } from '../../../supabase';
import { router } from 'expo-router';
 import * as SecureStore from 'expo-secure-store';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  
    const colorScheme = useColorScheme();

    const signOut = async () => {
        console.log("Clicked")
        try {
            const { error } = await supabase.auth.signOut();
    
            if (error) {
                throw error;
            }
    
            // Sign-out successful
            router.replace("/(authenticate)/userchoice")
            await SecureStore.deleteItemAsync("id");
            console.log('User signed out successfully');
        } catch (error) {
            if(error instanceof Error) console.error('Error signing out:', error.message);
        }
    };


  return (

        <Tabs
      screenOptions={{
        tabBarActiveTintColor: Palette.buttonOrLines,
        // headerShown: useClientOnlyValue(false, true),
        headerShown: false
      }}
      >
      <Tabs.Screen
        name="admindashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerShown: true, 
           headerRight: () => (
            
              <Pressable onPress={() => signOut()}>
                {({ pressed }) => ( 
                  <Entypo name="log-out" size={20} color="black"  style={{marginRight: 10}}/>
                )}
              
              </Pressable>
        
          ),
        }}
      />
      <Tabs.Screen
        name="adminprofile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="user-circle" color={color} />,
          // headerRight: () => (
          //   <Link href="/submissionbin" asChild>
          //     <Pressable>
          //       {({ pressed }) => (
          //         <FontAwesome
          //           name="info-circle"
          //           size={25}
          //           color={Colors[colorScheme ?? 'light'].text}
          //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          //         />
          //       )}
          //     </Pressable>
          //   </Link>
          // ),
        }}
      />
      
    </Tabs>
    
    
  );
}
