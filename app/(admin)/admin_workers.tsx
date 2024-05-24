import { StyleSheet, FlatList, Alert } from "react-native";
import { userType } from "../../Constants/Types";
import PatientCard from "../../components/patientcard";
import { TextInput } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import WorkerCard from "../../components/workercard";



const WorkersList = () => {
    const [workers, setWorkers] = useState<userType[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(()=> {
        getWorkers()
        
    },[])

    const getWorkers = async()=> {
      
        setLoading(true)
        try{
            const { data, error, status } = await supabase
            .from('users')
            .select()
            .eq("usertype", "Worker")

            if(error && status !== 406){
                throw error;
            }
    
            if(data){
                setWorkers(data);
            }
        }catch (error){
            if(error instanceof Error){
                Alert.alert(error.message)
            }
        }finally{
            setLoading(false)
        }
    }

    const filteredMonitoringData = workers?.filter(item =>
        item.firstname.toLowerCase().includes(search.toLowerCase()) ||
        item.lastname.toLowerCase().includes(search.toLowerCase())
    );



    const renderList = ({item}: {item: userType}) => <WorkerCard content = {item}/> 


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
 
}

export default WorkersList;

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

