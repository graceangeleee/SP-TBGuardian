import React from 'react';
import { Link, Tabs } from 'expo-router';
import { Pressable} from 'react-native';
import Colors from '../../../../Constants/Colors';
import { useColorScheme } from 'react-native';
import Palette from '../../../../Constants/Palette';
import { FontAwesome } from '@expo/vector-icons';


function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
 
  
  return (

      <Tabs
            screenOptions={{
              tabBarActiveTintColor: Palette.buttonOrLines,
            }}
            >
            <Tabs.Screen
              name="patientdashboard"
              options={{
                title: 'Home',
                headerShown: false,
                tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profile',
                headerShown: false,
                tabBarIcon: ({ color }) => <TabBarIcon name="user-circle" color={color} />,
                headerRight: () => (
                  <Link href="/profile" asChild>
                    <Pressable>
                      {({ pressed }) => (
                        <FontAwesome
                          name="user-circle"
                          size={25}
                          color={Colors[colorScheme ?? 'light'].text}
                          style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                        />
                      )}
                    </Pressable>
                  </Link>
                ),
              }}
            />
            
          </Tabs>
    ) 

}
