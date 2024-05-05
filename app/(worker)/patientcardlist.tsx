import { StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { userType } from "../../Constants/Types";
import PatientCard from "../../components/patientcard";
import { useWorkerData } from "./_layout";

const PatientCardList = () => {
    const {monitoring, done, missing, setMonitoring, setMissing, setDone} = useWorkerData();
    const params = useLocalSearchParams();
    const { type } = params;


    const renderList = ({item}: {item: userType}) => <PatientCard content = {item}/> 

    if(type === "Monitoring"){
        return(
 
            <FlatList 
                data={monitoring}
                renderItem={renderList}
                keyExtractor={(item) => item.id}
            />
    
        )
    }else if (type === "Done"){
        return(

            <FlatList 
                data={done}
                renderItem={renderList}
                keyExtractor={(item) => item.id}
            />
 
        )
    }else{
        return(
            <></>
        )
    }
}

export default PatientCardList;

const styles = StyleSheet.create({

})

