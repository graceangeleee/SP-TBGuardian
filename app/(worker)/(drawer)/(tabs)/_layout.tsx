import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, Alert, ActivityIndicator } from 'react-native';
import Colors from '../../../../Constants/Colors';
import { useColorScheme } from 'react-native';
import Palette from '../../../../Constants/Palette';
import { useClientOnlyValue } from '../../../../components/useClientOnlyValue';
import { useWorkerData } from '../../_layout';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '../../../../supabase';
import { useState, useEffect } from 'react';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [loading, setLoading]= useState(false);
  const {monitoring, done, missing, setMonitoring, setMissing, setDone, unverified, setUnverified, userid, user, setUser, verified, setVerified} = useWorkerData();
    
    useEffect(()=> {
        getDashboardData()
    }, [])



    async function getDashboardData(){
        setLoading(true)
        await Promise.all([getMonitoring(), getDone(), getMissing(), getUnverified(), getVerified(), getUser()]);
        setLoading(false);
    }

async function getMonitoring(){
    setLoading(true)
     try{
         const { data, error, status } = await supabase
         .from('users')
         .select()
         .eq("status", "FALSE")

         if(error && status !== 406){
             throw error;
         }
 
         if(data){
             setMonitoring(data);
         }
     }catch (error){
         if(error instanceof Error){
             Alert.alert(error.message)
         }
     }finally{
         setLoading(false)
     }
 }

async function getDone(){
    setLoading(true)
    try{
        const { data, error, status } = await supabase
        .from('users')
        .select()
        .eq("status", "TRUE")

        if(error && status !== 406){
            throw error;
        }

        if(data){
            setDone(data);
        }
    }catch (error){
        if(error instanceof Error){
            Alert.alert(error.message)
        }
    }finally{
        setLoading(false)
    }
}

async function getMissing(){
    setLoading(true)
    const date = new Date().toISOString();

    try{
        const { data, error, status } = await supabase
        .from('submissions')
        .select()
        .eq("status", "FALSE")
        .lt("deadline", date)

        if(error && status !== 406){
            throw error;
        }

        if(data){
            setMissing(data);
        }
    }catch (error){
        if(error instanceof Error){
            Alert.alert(error.message)
        }
    }finally{
        setLoading(false)
    }
}

async function getVerified(){
    setLoading(true)
    const date = new Date().toISOString();

    try{
        const { data, error, status } = await supabase
        .from('submissions')
        .select()
        .eq("status", "TRUE")
        .eq("verified", "TRUE")

        if(error && status !== 406){
            throw error;
        }

        if(data){
            setVerified(data) 
        }
    }catch (error){
        if(error instanceof Error){
            Alert.alert(error.message)
        }
    }finally{
        setLoading(false)
    }
}

async function getUnverified(){
    setLoading(true)
    const date = new Date().toISOString();

    try{
        const { data, error, status } = await supabase
        .from('submissions')
        .select()
        .eq("status", "TRUE")
        .eq("verified", "TRUE")

        if(error && status !== 406){
            throw error;
        }

        if(data){
            setUnverified(data) 
        }
    }catch (error){
        if(error instanceof Error){
            Alert.alert(error.message)
        }
    }finally{
        setLoading(false)
    }
}

const getUser = async () => {
    const userid = await SecureStore.getItem("id")
    try{
        if (userid === null || userid === "") {
            throw new Error('No user logged in');
        } else {
            const { data, error, status } = await supabase
                .from('users')
                .select()
                .eq('id', userid)
                .single();
            
            if(data){
                setUser(data)
            }
        }
    }catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message);
        }
    } finally {
        return
    }
}


  return (
    loading? (
        <ActivityIndicator/>
    ): (
        <Tabs
      screenOptions={{
        tabBarActiveTintColor: Palette.buttonOrLines,
        // headerShown: useClientOnlyValue(false, true),
        headerShown: false
      }}
      >
      <Tabs.Screen
        name="workerdashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          
        }}
      />
      <Tabs.Screen
        name="profile"
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
    )
    
  );
}
