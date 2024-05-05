import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import { useState, useEffect } from "react";
import Palette from '../../../../Constants/Palette';
import { Link } from "expo-router";
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../../../supabase';
import { userType, submissionType } from '../../../../Constants/Types';
import { useWorkerData } from '../../_layout';


export default function WorkerDashboard({session}: {session: Session}) {
    const[loading, setLoading] = useState(false);
    const {monitoring, done, missing, setMonitoring, setMissing, setDone} = useWorkerData();
    
    useEffect(()=> {
        getDashboardData()
    }, [session])

    async function getDashboardData(){
        setLoading(true)
        await Promise.all([getMonitoring(), getDone(), getMissing()]);
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


  return (
    <View>
        {loading ? 
        (
                <></>
        ):
        (
            <ScrollView>
                <Link href={{pathname: "/patientcardlist", params: {patientlist: monitoring, type: "Monitoring"}}} asChild style={[styles.horizontalcontainer,{backgroundColor: Palette.focused, alignItems: 'center',  margin: 10, borderRadius: 15}]}>
                    <TouchableOpacity >
                    {/* <View style={[styles.horizontalcontainer, {backgroundColor: Palette.focused, alignItems: 'center'}]}> */}
                        <View style={{backgroundColor: Palette.focused, flex: 1, alignItems: 'center'}}>
                            <View style={{backgroundColor: Palette.focused, borderColor: 'white', borderRadius: 90, borderWidth: 5, width: 90, height: 90, alignItems: 'center'}}>
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
                            <View style={{backgroundColor: Palette.shadowAccent, flex: 1, alignItems: 'center'}}>
                                <View style={{backgroundColor: Palette.shadowAccent, borderColor: 'white', borderRadius: 90, borderWidth: 5, width: 90, height: 90, alignItems: 'center'}}>
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
                            <View style={{backgroundColor: Palette.background, borderColor: 'white', borderRadius: 90, borderWidth: 5, width: 90, height: 90, alignItems: 'center'}}>
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
                <Link href="/addpatient" asChild>
                    <TouchableOpacity>
                        <View style={styles.addpatient}>
                            <Text style={{textAlign: 'center', fontFamily: 'Poppins', alignSelf: 'center', fontSize: 16}}>Add Patient</Text>
                        </View>
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
        borderRadius: 60,
        backgroundColor: Palette.buttonOrLines,
        borderColor: 'white',
        borderWidth: 1
    },
    buttontext:{
        // fontFamily: 'Poppins',
        fontSize: 16,
        alignSelf: 'center',
        color: 'white'
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
        position: 'absolute',
        height: 80,
        width: 80,
        backgroundColor: Palette.buttonOrLines,
        borderRadius: 90,
        alignItems: 'center',
        alignContent: 'center'
    }
});
