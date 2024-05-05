import { FlatList } from "react-native";
import { submissionType } from "../../Constants/Types";
import { useWorkerData } from "./_layout";
import SubmissionCard from "../../components/submissioncard";

const MissingList = () => {
    const { missing } = useWorkerData();

    const renderList = ({item}: {item: submissionType}) => <SubmissionCard content = {item} type="Missing"/> 


    return(
        <FlatList 
            data={missing}
            renderItem={renderList}
            keyExtractor={(item) => item.id}
        />
    )
}

export default MissingList;