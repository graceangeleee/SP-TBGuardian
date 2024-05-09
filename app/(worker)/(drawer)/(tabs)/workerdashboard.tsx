import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import { useState, useEffect } from "react";
import Palette from '../../../../Constants/Palette';
import { Link } from "expo-router";
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../../../supabase';
import { useWorkerData } from '../../_layout';
import { FontAwesome } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';



export default function WorkerDashboard({session}: {session: Session}) {
    const[loading, setLoading] = useState(false);
    const {monitoring, done, missing, setMonitoring, setMissing, setDone, unverified, setUnverified, userid, user, setUser} = useWorkerData();
    
    useEffect(()=> {
        getDashboardData()
    }, [session])

    async function getDashboardData(){
        setLoading(true)
        await Promise.all([getMonitoring(), getDone(), getMissing(), getUnverified(), getUser()]);
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

async function getUnverified(){
    setLoading(true)
    const date = new Date().toISOString();

    try{
        const { data, error, status } = await supabase
        .from('submissions')
        .select()
        .eq("status", "TRUE")
        .eq("verified", "FALSE")

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
    <View>
        {loading ? 
        (
                <></>
        ):
        (
            <ScrollView>
                <View style={{padding: 15, flexDirection: 'row'}}>
                    <Text style={{flex: 4, fontFamily: 'Heading', fontSize: 20, alignSelf: 'center'}}>
                        Register a new patient?
                    </Text>
                    <Link href="/addpatient" asChild style={{flex: 1, justifyContent: 'center'}}>
                        <TouchableOpacity style={{alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
                            <View style={styles.addpatient}>
                                <Text style={{textAlign: 'center', fontFamily: 'Heading', fontSize: 16, color: 'white'}}>Add Patient</Text>
                            </View>
                        </TouchableOpacity>
                    </Link>
                </View>

 
                <View style={{flexDirection: 'row', alignContent: 'space-between', marginTop: -10, marginBottom: -10}}>
                    <View style={[styles.card, {backgroundColor: Palette.buttonOrLines}]}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <FontAwesome style={{flex: 1}} name="tasks" size={24} color="white" />
                            <Text style={styles.cardtitle}>Unverified Submissions</Text>
                            
                                
                        </View>
                        <Text style={styles.cardcontent}>
                                    There are {unverified?.length} unverified submssions
                        </Text>
                        <View style={[{backgroundColor: Palette.accent}, styles.button]}>
                            <Link href={{pathname: "/unverified"}} style={{alignSelf: 'center'}}>
                                {/* <TouchableOpacity> */}
                                    <Text style={styles.buttontext}>See submissions</Text>
                                {/* </TouchableOpacity> */}
                            </Link>
                        </View>
                      
                    </View>
                    <View style={[styles.card, {backgroundColor: Palette.accent}]}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <FontAwesome style={{flex: 1}} name="calendar" size={24} color="white" />
                            <Text style={styles.cardtitle}>Calendar</Text>
                        </View>
                        <View style={[{backgroundColor: Palette.buttonOrLines}, styles.button]}>
                            <Link href={{pathname: "/workerschedule"}} style={{alignSelf: 'center'}}>
                                {/* <TouchableOpacity> */}
                                    <Text style={styles.buttontext}>See schedule</Text>
                                {/* </TouchableOpacity> */}
                            </Link>
                        </View>
                    </View>
                </View>
                <Link href={{pathname: "/patientcardlist", params: {patientlist: monitoring, type: "Monitoring"}}} asChild style={[styles.horizontalcontainer,{backgroundColor: Palette.focused, alignItems: 'center',  margin: 10, borderRadius: 15}]}>
                    <TouchableOpacity >
                    {/* <View style={[styles.horizontalcontainer, {backgroundColor: Palette.focused, alignItems: 'center'}]}> */}
                        <View style={{backgroundColor: Palette.focused, flex: 1, alignItems: 'center'}}>
                            <View style={{backgroundColor: Palette.focused, borderColor: 'white', borderRadius: 90, borderWidth: 5, width: 90, height: 90, alignItems: 'center', justifyContent: 'center'}}>
                               {monitoring !== null ? (
                                <Text style={styles.count}>{monitoring.length}</Text>
                               ):
                               (
                                <></>
                               )}
                                
                            </View>
                        </View>
                        <Text style={[{flex: 2}, styles.workerdashboard]}>MONITORING</Text>
                    {/* </View> */}
                    </TouchableOpacity>
                </Link>
                <Link href={{pathname: "/missinglist"}} asChild style={[styles.horizontalcontainer,{backgroundColor: Palette.shadowAccent, alignItems: 'center',  margin: 10, borderRadius: 15}]}>
                    <TouchableOpacity >
                        {/* <View style={[styles.horizontalcontainer, {backgroundColor: Palette.focused, alignItems: 'center'}]}> */}
                            <View style={{backgroundColor: Palette.shadowAccent, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <View style={{backgroundColor: Palette.shadowAccent, borderColor: 'white', borderRadius: 90, borderWidth: 5, width: 90, height: 90, alignItems: 'center', justifyContent: 'center'}}>
                                    {missing!==null? (
                                        <Text style={styles.count}>{missing.length}</Text>
                                    ):(
                                        <></>
                                    )}
                                    
                                </View>
                            </View>
                            <Text style={[{flex: 2}, styles.workerdashboard]}>MISSING</Text>
                        {/* </View> */}
                    </TouchableOpacity>
                </Link>
                <Link href={{pathname: "/patientcardlist", params: {patientlist: done, type: "Done"}}} asChild style={[styles.horizontalcontainer,{backgroundColor: Palette.background, alignItems: 'center',  margin: 10, borderRadius: 15}]}>
                <TouchableOpacity >
                    {/* <View style={[styles.horizontalcontainer, {backgroundColor: Palette.focused, alignItems: 'center'}]}> */}
                        <View style={{backgroundColor: Palette.background, flex: 1, alignItems: 'center'}}>
                            <View style={{backgroundColor: Palette.background, borderColor: 'white', borderRadius: 90, borderWidth: 5, width: 90, height: 90, alignItems: 'center', justifyContent: 'center'}}>
                                {done !== null ? (
                                    <Text style={styles.count}>{done.length}</Text>
                                ):
                                (
                                    <></>
                                )}
                                
                            </View>
                        </View>
                        <Text style={[{flex: 2}, styles.workerdashboard]}>DONE</Text>
                    {/* </View> */}
                </TouchableOpacity>
                </Link>
                
            </ScrollView>
        )
   
    }
    </View>

  )
}

const styles = StyleSheet.create({
    horizontalcontainer:{
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'rgba(52, 52, 52, alpha)'
    },
    colcontainer:{
        flex: 1,
        margin: 5,
        padding: 15,
        height: 250,
        borderRadius: 15,
    },
    rowcontainer:{
        height: 150,
        alignContent: 'center',
        alignItems: 'center',
        margin: 10,
        padding: 10,
        borderRadius: 15
    },
    rewardscontainer:{
        borderColor: Palette.buttonOrLines,
        borderWidth: 2,
        margin: 10,
        padding: 20,
        borderRadius: 15
    },
    percentage:{
        borderRadius: 90,
        height: 100,
        width: 100,
        backgroundColor: Palette.shadowAccent,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Palette.buttonOrLines,
        borderWidth: 4,
    },
    status:{
        // fontFamily: 'Heading',
        fontSize: 25,
        color: 'white'

    },
    statustext:{
        // fontFamily: 'Heading',
        fontSize: 20,
        alignSelf: 'center',
        marginLeft: 20,
        color: Palette.buttonOrLines
    },
    statuscontainer:{
        margin: 15,
        // borderColor: Palette.buttonOrLines,
        // borderWidth: 2,
        alignContent: 'center',
        borderRadius: 15,
    },
    details:{
        // fontFamily: 'Poppins',
        fontSize: 16,
        marginTop: 10,
        color: 'white'
    },
    rewardins:{
        // fontFamily: 'Poppins',
        fontSize: 16,
        marginTop: 10,
        color: Palette.buttonOrLines
    },
    shadowprop: {
        shadowColor: 'black',
        shadowOffset: {width: -2, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    elevation: {
        elevation: 10,
        shadowColor: '#52006A',
    },
    rewardsearned:{
        // fontFamily: 'Heading',
        fontSize: 20,
        marginLeft: 15
    },
    reward:{
        // fontFamily: 'Subheading',
        fontSize: 20,
    },
    detailheader:{
        // fontFamily: 'Heading',
        fontSize: 20,
        color: 'white'
    },
    button:{
        padding: 10,
        borderRadius: 20,
        // backgroundColor: Palette.buttonOrLines,
        borderColor: 'white',
        borderWidth: 1,
        textAlign: 'center'
    },
    buttontext:{
        fontFamily: 'Poppins',
        fontSize: 16,
        color: 'white',
        justifyContent: 'center'
    },
    workerdashboard:{
        // fontFamily: 'Heading',
        fontSize: 30,
        color: 'white'
    },
    count:{
        // fontFamily: 'Poppins',
        fontSize: 30,
        color: 'white'
    },
    addpatient:{
        alignSelf: 'flex-end',
        height: 90,
        width: 90,
        backgroundColor: Palette.buttonOrLines,
        borderRadius: 90,
        justifyContent: 'center'

    },
    card:{
        borderRadius: 20,
        flex: 1,
        margin: 10,
        height: 230,
        borderColor: Palette.background,
        borderWidth: 2,
        padding: 15
    },
    cardtitle:{
        fontFamily: 'Heading',
        color: 'white',
        fontSize: 20,
        flex: 4,
        // textDecorationLine: 'underline'
    },
    cardcontent:{
        fontFamily: 'Poppins',
        fontSize: 16,
        color: 'white',
        marginTop: 10
    },
  
});
