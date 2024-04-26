import { Redirect, Stack} from 'expo-router';


export default function App() {

  return (
    <Redirect href={"/(drawer)/(tabs)/patientdashboard"}/>
  )
}