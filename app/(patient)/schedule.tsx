import React, { useState, useEffect} from "react";
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity} from "react-native";
import { Calendar } from "react-native-calendars";
import { agendaType } from "../../Constants/Types";
import * as SecureStore from 'expo-secure-store';
import { supabase } from "../../supabase";
import Palette from "../../Constants/Palette";
import AgendaCard from "../../components/agendacard";

const Schedule: React.FC = () => {
    const [markedDates, setMarkedDates] = useState<{ [date: string]: { marked: boolean } }>({});
    const [confirmedAgenda, setConfirmedAgenda] = useState<agendaType[]>([])
    const [pendingAgenda, setPendingAgenda] = useState<agendaType[]>([])
    const [loading, setLoading] = useState(false)
    const [confirmedPressed, setConfirmedPressed] = useState(true);
    const [pendingPressed, setPendingPressed] = useState(false);
    
    useEffect(()=> {
        getPendingAgenda()
        getConfirmedAgenda()
    }, [])



    const getPendingAgenda = async () =>{
        setLoading(true)
        try{
            const userid = await SecureStore.getItem("id")

            const{data, error, status} = await supabase
            .from('agenda')
            .select()
            .eq("patientid", userid)
            .eq("status", "FALSE")
            .eq("confirmed", "FALSE")

            if(error && status !==406){
                throw error;
            }
            if(data){
                setPendingAgenda(data)
            }

        }catch(error){
            if(error instanceof Error) Alert.alert(error.message)
        }finally{
            setLoading(false)
        }
    }

    const getConfirmedAgenda = async () =>{
        setLoading(true)
        try{
            const userid = await SecureStore.getItem("id")

            const{data, error, status} = await supabase
            .from('agenda')
            .select()
            .eq("patientid", userid)
            .eq("status", "FALSE")
            .eq("confirmed", "TRUE")

            if(error && status !==406){
                throw error;
            }
            if(data){
                setConfirmedAgenda(data)
            }

        }catch(error){
            if(error instanceof Error) Alert.alert(error.message)
        }finally{
            setLoading(false)
        }
    }

    const confirmAgenda = async (id: string, patientid: string) => {
        const userid = await SecureStore.getItem("id")
        if(userid!==null && userid == patientid){
            try{
                const {error} = await supabase
                .from('agenda')
                .update({confirmed: 'TRUE'})
                .eq("id", id)

                if(error){
                    console.log("Failed to confirm agenada")
                }

                getConfirmedAgenda()
                getPendingAgenda()

                Alert.alert("Succcesfully confirmed agenda")
            }catch(error){
                if(error instanceof Error) Alert.alert(error.message)
            }
        }
    }

    //function that retrieves the agendas that were set from the database
    
    const renderList = ({item} : {item: agendaType}) => <AgendaCard id = {item.id} patientid={item.patientid} workerid={item.workerid} content={item.text} date={item.date} time={item.time} confirmed={item.confirmed} type="Patient" confirmButton={confirmAgenda}/>

    const togglePending = () => {
        if(pendingPressed===false) {
            setPendingPressed(true)
            setConfirmedPressed(false)
        }
    }

    const toggleConfirmed = () => {
        if(confirmedPressed===false){
            setConfirmedPressed(true)
            setPendingPressed(false)
        }
    }

    return(
        <View style={styles.container}>
             <Calendar
                markedDates={markedDates}
                style={{margin: 10, borderRadius: 10, borderWidth: 1, borderColor: Palette.buttonOrLines}}
            />

            {/* switch (like tab) that switches between confirmed and not confirmed agenda */}
            <View style={styles.switchcontainer}>
                <TouchableOpacity onPress={toggleConfirmed} style={[styles.switch, confirmedPressed? {borderBottomWidth: 3, borderColor: Palette.buttonOrLines} : {}]}>
                    <Text style={styles.switchtext}>CONFIRMED</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={togglePending} style={[styles.switch, pendingPressed? {borderBottomWidth: 3, borderColor: Palette.buttonOrLines} : {}]}>
                    <Text style={styles.switchtext}>PENDING</Text>
                </TouchableOpacity>
            </View>

            {/* agenda flatlist */}
            <View style={styles.flatListContainer}>
                {confirmedPressed ? (
                    <FlatList
                        data={confirmedAgenda}
                        renderItem={renderList}
                        keyExtractor={(item)=>item.id}
                    />
                ) : (
                    <FlatList
                        data={pendingAgenda}
                        renderItem={renderList}
                        keyExtractor={(item)=>item.id}
                    />
                )}
            </View>

        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    switchcontainer: {
        flexDirection: 'row',
        margin: 10,
    },
    switch: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 10, 
    },
    switchtext: {
        fontFamily: 'Poppins',
        fontSize: 16
    },
    flatListContainer: {
        flex: 1,
    }
})



export default Schedule;