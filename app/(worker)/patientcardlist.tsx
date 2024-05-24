import { StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { userType } from "../../Constants/Types";
import PatientCard from "../../components/patientcard";
import { useWorkerData } from "./_layout";
import { TextInput } from "react-native";
import { useState } from "react";

const PatientCardList = () => {
    const {monitoring, done, setMonitoring, setDone} = useWorkerData();
    const params = useLocalSearchParams();
    const { type } = params;
    const [search, setSearch] = useState("")

    const filteredMonitoringData = monitoring?.filter(item =>
        item.firstname.toLowerCase().includes(search.toLowerCase()) ||
        item.lastname.toLowerCase().includes(search.toLowerCase())
    );

    const filteredDoneData = done?.filter(item =>
        item.firstname.toLowerCase().includes(search.toLowerCase()) ||
        item.lastname.toLowerCase().includes(search.toLowerCase())
    );

    const renderList = ({item}: {item: userType}) => <PatientCard content = {item}/> 

    if(type === "Monitoring"){
        return(
            <>
            <TextInput placeholder="Search"
                onChangeText={setSearch}
                style={styles.input}
            />
            <FlatList 
                data={filteredMonitoringData}
                renderItem={renderList}
                keyExtractor={(item) => item.id}
            />
            </>
    
        )
    }else if (type === "Done"){
        return(
            <>
            <TextInput placeholder="Search"
                onChangeText={setSearch}
                style={styles.input}
            />
            <FlatList 
                data={filteredDoneData}
                renderItem={renderList}
                keyExtractor={(item) => item.id}
            />
            </>
 
        )
    }else{
        return(
            <></>
        )
    }
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

