import React from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { router, usePathname, Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Text, Alert } from 'react-native';
import { FontAwesome,
         MaterialIcons,
         Entypo 
} from '@expo/vector-icons';
import Palette from '../../../Constants/Palette';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { supabase } from '../../../supabase';
import * as SecureStore from 'expo-secure-store';
import { useWorkerData } from '../_layout';


const PatientDrawerContent: React.FC<any> = (props) => {
    const pathname = usePathname();
    const [loading, setLoading]= useState(false);
    const {monitoring, done, setMonitoring,  setDone,  userid, user, setUser, } = useWorkerData();
      

    useEffect(() => {
      console.log(pathname);
    }, [pathname]);

    useEffect(()=> {
        getDashboardData()
    }, [])


    async function getDashboardData(){
        setLoading(true)
        await Promise.all([getMonitoring(), getDone(), getUser()]);
        setLoading(false);
    }

      async function getMonitoring(){
        const userid = await SecureStore.getItem("id")
        setLoading(true)
        try{
            const { data, error, status } = await supabase
            .from('users')
            .select()
            .eq("status", "FALSE")
            .eq("workerid", userid)

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
        const userid = await SecureStore.getItem("id")
        setLoading(true)
        try{
            const { data, error, status } = await supabase
            .from('users')
            .select()
            .eq("status", "TRUE")
            .eq("workerid", userid)

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
    <DrawerContentScrollView style={styles.drawer} {...props}>
      <View style={styles.drawerheader}>
        {/* <Image source={{uri: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.svgrepo.com%2Fsvg%2F384674%2Faccount-avatar-profile-user-11&psig=AOvVaw1d2ih2wyOyQXGLeyjjqX0F&ust=1709887737656000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCMCtma3i4YQDFQAAAAAdAAAAABAJ'}} height={80} width={80}/> */}
        <FontAwesome name="user-circle" size={100} color="white" />
        <Text style={styles.name}>{user?.firstname} {user?.lastname}</Text> 
      </View>
      <DrawerItem
        label={'Profile'}
        icon={({ color, size }) => (
            <FontAwesome name="user-circle" size={30} color={pathname == "/workerprofile" ? Palette.buttonOrLines : 'white'} />
        )}
        labelStyle={[styles.drawerLabel, {color: pathname == "/workerprofile" ? Palette.buttonOrLines : 'white'}]}
        style={{backgroundColor: pathname == "/workerprofile" ? Palette.shadowAccent : Palette.buttonOrLines}}
        onPress={() => {
            router.push('/(drawer)/(tabs)/workerprofile');
        }}
      />
  
      <TouchableOpacity style={{backgroundColor: Palette.buttonOrLines, marginLeft: 20, flexDirection: 'row', alignItems: 'center'}} onPress={signOut}>
        <Entypo name="log-out" size={30} color="white" />
        <Text style={[styles.drawerLabel, {marginLeft: 10}]}>Log out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const DrawerLayout: React.FC = () => {
  return (
    
  <Drawer screenOptions={{headerTitle: "", headerStatusBarHeight: 0}} drawerContent={(props) => <PatientDrawerContent {...props} />} />
  )
};

export default DrawerLayout;

const styles = StyleSheet.create({
    drawerLabel: {
        marginLeft: -20,
        fontSize: 16,
        fontFamily: "Subheading",
        color: 'white'
    },
    drawer:{
        backgroundColor: Palette.buttonOrLines,
    },
    drawerheader:{
      backgroundColor: Palette.buttonOrLines, 
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 10
    },
    name:{
      marginTop: 10,
      fontFamily: 'Heading',
      fontSize: 20,
      color: 'white'
    }
})