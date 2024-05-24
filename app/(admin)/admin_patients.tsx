import { StyleSheet, FlatList, Alert } from "react-native";
import { userType } from "../../Constants/Types";
import PatientCard from "../../components/patientcard";
import { TextInput } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";



const PatientsList = () => {
    const [monitoring, setMonitoring] = useState<userType[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(()=> {
        getMonitoring()
        
    },[])

    const getMonitoring = async()=> {
      
        setLoading(true)
        try{
            const { data, error, status } = await supabase
            .from('users')
            .select()
            .eq("usertype", "Patient")

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

    const filteredMonitoringData = monitoring?.filter(item =>
        item.firstname.toLowerCase().includes(search.toLowerCase()) ||
        item.lastname.toLowerCase().includes(search.toLowerCase())
    );



    const renderList = ({item}: {item: userType}) => <PatientCard content = {item} usertype= "Admin"/> 


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

export default PatientsList;

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

