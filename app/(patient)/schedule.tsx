import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList} from "react-native";
import { Calendar } from "react-native-calendars";
import { agendaType } from "../../Constants/Types";

const Schedule: React.FC = () => {
    const [markedDates, setMarkedDates] = useState<{ [date: string]: { marked: boolean } }>({});
    const [agendaItems, setAgendaItems] = useState<agendaType[]>([]);
    
    const onDayPress = () => {

    }

    const updateAgendaItems = (items: agendaType[]) =>{
        setAgendaItems(items)
    }
    
    const renderList = ({item} : {item: agendaType}) => {
        return(
            <View>
                <Text>{item.text}</Text>
            </View>
        )
    }

    return(
        <View>
            <Calendar 
                markedDates={markedDates}
                onDayPress={onDayPress}
            />
            <FlatList 
                data={agendaItems}
                renderItem={renderList}
                keyExtractor={(item)=> item.id}
            />
        </View>
    )
}


const styles = StyleSheet.create({

})


export default Schedule;1