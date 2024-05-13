import React from 'react';
import { Link, Tabs } from 'expo-router';
import { Pressable, Alert, ActivityIndicator } from 'react-native';
import Colors from '../../../../Constants/Colors';
import { useColorScheme } from 'react-native';
import Palette from '../../../../Constants/Palette';
import { FontAwesome } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '../../../../supabase';
import { useUserData } from '../../_layout';
import { useState, useEffect } from 'react';
import { submissionType } from '../../../../Constants/Types';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState<submissionType[]>([])
  const { setUser, setPending } = useUserData();

  useEffect(() => {
    getDetails();

}, [])

async function getDetails() {
  setLoading(true);
  try {
      const id = await SecureStore.getItemAsync("id");
      if (id != null) {
          getPendingDetails(id)
          getUserData(id)
          getMissing(id)

      } else {
          console.log("No session")
      }
  } catch (error) {
      console.log("Error retrieving data")
  } finally {
      setLoading(false)
  }
}

async function getMissing(userid: string) {
  setLoading(true)
  const date = new Date().toISOString();

  try {
      if (userid === null || userid === "") {
          throw new Error('No user logged in');
      } else {
          const { data, error, status } = await supabase
              .from('submissions')
              .select()
              .eq("patientid", userid)
              .eq("status", "FALSE")
              .lt("deadline", date)


          if (error && status !== 406) {
              throw error;
          }

          if (data) {
              setMissing(data)
          }
      }
  } catch (error) {
      if (error instanceof Error) {
          Alert.alert(error.message)
      }
  } finally {
      setLoading(false)
  }
}

async function getPendingDetails(userid: string) {
  setLoading(true)
  const date = new Date().toISOString();
  try {
      if (userid === null || userid === "") {
          throw new Error('No user logged in');
      } else {
          const { data, error, status } = await supabase
              .from('submissions')
              .select()
              .eq("patientid", userid) 
              .gte("deadline", date)


          if (error && status !== 406) {
              throw error;
          }

          if (data) {
              data.sort((a, b) => a.number - b.number)
              setPending(data)
          }
      }
  } catch (error) {
      if (error instanceof Error) {
          Alert.alert(error.message)
      }
  } finally {
      setLoading(false)
  }
}

async function getUserData(userid: string) {
  setLoading(true)
  try {
      if (userid === null || userid === "") {
          throw new Error('No user logged in');
      } else {
          const { data, error, status } = await supabase
              .from('users')
              .select()
              .eq('id', userid)
              .single();

          if (data) {
              setUser(data)

          }
      }
  } catch (error) {
      if (error instanceof Error) {
          Alert.alert(error.message);
      }
  } finally {
      setLoading(false)
  }
}

  return (
    loading? (
      <ActivityIndicator/>
    ) : (
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
    
  );
}
