import { FlatList, Alert } from "react-native";
import { submissionType, userType } from "../../Constants/Types";
import SubmissionCard from "../../components/submissioncard";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase";

const SubmissionCardList = () => {
    const params = useLocalSearchParams()
    const [submissions, setSubmissions] = useState<submissionType[] | null>(null);
    const renderList = ({item}: {item: submissionType}) => <SubmissionCard content = {item} type=""/> 
    const [loading, setLoading] = useState(false)

    useEffect(()=> {
        getSubmissions()
    }, [])

    async function getSubmissions(){
        setLoading(true)
        try{
            const { data, error, status } = await supabase
            .from('submissions')
            .select()
            .eq("patientid", params.patientid)

            if(error && status !== 406){
                throw error;
            }

            if(data){
                setSubmissions(data);
            }
        }catch (error){
            if(error instanceof Error){
                Alert.alert(error.message)
            }
        }finally{
            setLoading(false)
        }
    }

    return(
        <>
        {loading ? (
        <></>
        ):
        (<FlatList 
            data={submissions}
            renderItem={renderList}
            keyExtractor={(item) => item.id}
        />)}
        </>
        
    )
}

export default SubmissionCardList;