import React from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { router, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import { FontAwesome,
         MaterialIcons,
         Entypo 
} from '@expo/vector-icons';
import Palette from '../../../Constants/Palette';
import { TouchableOpacity } from 'react-native-gesture-handler';


const PatientDrawerContent: React.FC<any> = (props) => {
    const pathname = usePathname();

    useEffect(() => {
        console.log(pathname);
    }, [pathname]);

    return (
    <DrawerContentScrollView style={styles.drawer} {...props}>
      <View style={styles.drawerheader}>
        {/* <Image source={{uri: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.svgrepo.com%2Fsvg%2F384674%2Faccount-avatar-profile-user-11&psig=AOvVaw1d2ih2wyOyQXGLeyjjqX0F&ust=1709887737656000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCMCtma3i4YQDFQAAAAAdAAAAABAJ'}} height={80} width={80}/> */}
        <FontAwesome name="user-circle" size={100} color="white" />
        <Text style={styles.name}>Placeholder Name</Text> 
      </View>
      <DrawerItem
        label={'Profile'}
        icon={({ color, size }) => (
            <FontAwesome name="user-circle" size={30} color={pathname == "/profile" ? Palette.buttonOrLines : 'white'} />
        )}
        labelStyle={[styles.drawerLabel, {color: pathname == "/profile" ? Palette.buttonOrLines : 'white'}]}
        style={{backgroundColor: pathname == "/profile" ? Palette.shadowAccent : Palette.buttonOrLines}}
        onPress={() => {
            router.push('/(drawer)/(tabs)/profile');
        }}
      />

      <DrawerItem
        label={'History'}
        onPress={() => {
          router.push('/(drawer)/(tabs)/history');
        }}
        icon={({ color, size }) => (
            <MaterialIcons name="history" size={30} color={pathname == "/history" ? Palette.buttonOrLines : 'white'} />
        )}
        labelStyle={[styles.drawerLabel, {color: pathname == "/history" ? Palette.buttonOrLines : 'white'}]}
        style={{backgroundColor: pathname == "/history" ? Palette.shadowAccent : Palette.buttonOrLines}}
      />
      <DrawerItem
        label={'Instructions'}
        onPress={() => {
          router.push('/(drawer)/(tabs)/instruction');
        }}
        icon={({color, size}) => (
            <FontAwesome name="book" size={30} color={pathname == "/instruction" ? Palette.buttonOrLines : 'white'} />
        )}
        labelStyle={[styles.drawerLabel, {color: pathname == "/instruction" ? Palette.buttonOrLines : 'white'}]}
        style={{backgroundColor: pathname == "/instruction" ? Palette.shadowAccent : Palette.buttonOrLines}}
      />
      <DrawerItem
        label={'Rewards'}
        onPress={() => {
          router.push('/(drawer)/(tabs)/rewards');
        }}
        icon={({ color, size }) => (
            <FontAwesome name="gift" size={30} color = {pathname == "/rewards" ? Palette.buttonOrLines : 'white'} />
        )}
        labelStyle={[styles.drawerLabel, {color: pathname == "/rewards" ? Palette.buttonOrLines : 'white'}]}
        style={{backgroundColor: pathname == "/rewards" ? Palette.shadowAccent
        
         : Palette.buttonOrLines}}
      />
       <DrawerItem
        label={'Settings'}
        onPress={() => {
          router.push('/(drawer)/(tabs)/settings');
        }}
        icon={({ color, size }) => (
            <MaterialIcons name="settings" size={30} color = {pathname == "/settings" ? Palette.buttonOrLines : 'white'} />
        )}
        labelStyle={[styles.drawerLabel, {color: pathname == "/settings" ? Palette.buttonOrLines : 'white'}]}
        style={{backgroundColor: pathname == "/settings" ? Palette.shadowAccent : Palette.buttonOrLines}}
      />
      <TouchableOpacity style={{backgroundColor: Palette.buttonOrLines, marginLeft: 20, flexDirection: 'row', alignItems: 'center'}}>
        <Entypo name="log-out" size={30} color="white" />
        <Text style={[styles.drawerLabel, {marginLeft: 10}]}>Log out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const DrawerLayout: React.FC = () => {
  return (
  <Drawer drawerContent={(props) => <PatientDrawerContent {...props} />} />
  )
};

export default DrawerLayout;

const styles = StyleSheet.create({
    drawerLabel: {
        marginLeft: -20,
        fontSize: 16,
        fontFamily: "Subheading",
        color: 'white'
    },
    drawer:{
        backgroundColor: Palette.buttonOrLines,
    },
    drawerheader:{
      backgroundColor: Palette.buttonOrLines, 
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 10
    },
    name:{
      marginTop: 10,
      fontFamily: 'Heading',
      fontSize: 20,
      color: 'white'
    }
})