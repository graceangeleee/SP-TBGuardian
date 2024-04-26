import { Stack } from "expo-router";

export default function Layout(){
    return(
        <Stack>
            <Stack.Screen name="userchoice" options={{headerShown: false}}/>
            <Stack.Screen name="patientlogin" options={{headerShown: true, headerBackTitle:"Back", headerTitle: "Patient Login"}}/>
            <Stack.Screen name="workerlogin" options={{headerShown: true, headerBackTitle:"Back", headerTitle: "Worker Login"}}/>
        </Stack>
    )
}