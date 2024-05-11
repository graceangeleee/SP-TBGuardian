import { View, Text, StyleSheet, FlatList} from "react-native";
import { useWorkerData } from "./_layout";
import { submissionType } from "../../Constants/Types";
import SubmissionCard from "../../components/submissioncard";

const Unverified = () => {
    const {unverified} = useWorkerData();

    
    const renderList = ({item}: {item: submissionType}) => <SubmissionCard content = {item} type="Unverified" /> 

    return(
        <>
           { unverified?.length!==0 ?
            (
                    <FlatList 
                        data={unverified}
                        renderItem={renderList}
                        keyExtractor={(item) => item.id}
                    />
                ):
                (
                    <View>
                        <Text> No unverified submissions yet</Text>
                    </View>
                )
            }
        
        </>
        
    )
}

export default Unverified;