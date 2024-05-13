import { FlatList, Alert } from "react-native";
import { submissionType } from "../../Constants/Types";
import { useWorkerData } from "./_layout";
import SubmissionCard from "../../components/submissioncard";
import * as SMS from 'expo-sms';
import { useState, useEffect } from "react";

const MissingList = () => {
    const { missing } = useWorkerData();
    const [smsAvailable, setSMSAvailable] = useState(false);
    const renderList = ({item}: {item: submissionType}) => <SubmissionCard content = {item} type="Missing" smsAvailable={smsAvailable}/> 

    useEffect(()=> {
        missing?.sort((a,b)=> a.number - b.number)
        checkSMS()
    }, [])

    const checkSMS = async () => {
        const isAvailable = await SMS.isAvailableAsync();

        if(isAvailable) setSMSAvailable(true)
    }

   

    return(
        <FlatList 
            data={missing}
            renderItem={renderList}
            keyExtractor={(item) => item.id}
        />
    )
}

export default MissingList;