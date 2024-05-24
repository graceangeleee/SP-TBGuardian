import { StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { userType } from "../../../Constants/Types";
import PatientCard from "../../../components/patientcard";
import { useWorkerData } from "../_layout";
import { TextInput, Alert } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "../../../supabase";
import * as SecureStore from 'expo-secure-store';

const PatientCardList = () => {
    const {monitoring, done , setMonitoring, setDone} = useWorkerData();
    const params = useLocalSearchParams();
    const { type } = params;
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [patients, setPatients] = useState<userType[]>([])

    useEffect(()=> {
        getPatients()
    })

    const getPatients = async () => {
        const userid = await SecureStore.getItem("id")
        setLoading(true)
        try{
            const{data, error, status} = await supabase
            .from('users')
            .select()
            .eq("usertype", "Patient")
            .eq("workerid", userid)

            if(error){
               Alert.alert(error.message)
            }else{
                setPatients(data)
            }
        }catch(error){
            if(error instanceof Error)Alert.alert(error.message)
        }
    }

  
    const filteredPatientData = patients?.filter(item =>
        item.firstname.toLowerCase().includes(search.toLowerCase()) ||
        item.lastname.toLowerCase().includes(search.toLowerCase())
    );

    const renderList = ({item}: {item: userType}) => <PatientCard content = {item}/> 

   
        return(
            <>
            <TextInput placeholder="Search"
                onChangeText={setSearch}
                style={styles.input}
            />
            <FlatList 
                data={filteredPatientData}
                renderItem={renderList}
                keyExtractor={(item) => item.id}
            />
            </>
        )

}

export default PatientCardList;

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 20,
        margin: 10,
        paddingHorizontal: 20,
        paddingVertical: 15,
        fontFamily: 'Poppins',
        fontSize: 16
    },
})

