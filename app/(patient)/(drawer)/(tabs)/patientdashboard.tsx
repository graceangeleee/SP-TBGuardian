import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import Palette from '../../../../Constants/Palette';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import { submissionType } from '../../../../Constants/Types';
import { useUserData } from '../../_layout';
import { supabase } from '../../../../supabase';
import * as SecureStore from 'expo-secure-store';
// import Push from '../../../../components/push';

export default function PatientDashboard() {
  const [percentage, setPercentage] = useState(0);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [missing, setMissing] = useState<submissionType[]>([]);
 
  const [pending, setPending] = useState<submissionType[]>([]);
  const {session} = useUserData()
 

  useEffect(() => {
    getMissing();
    getPending();
    getUserDetails()
  }, []);



  const getPending = async () => {
    setLoading(true);
    const date = new Date().toISOString();
    const id = await SecureStore.getItemAsync("id");
    try {
      if (!id) {
        throw new Error('No user logged in');
      } else {
        const { data, error, status } = await supabase
          .from('submissions')
          .select()
          .eq('patientid', id)
          .gt('deadline', date);

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          data.sort((a, b) => a.number - b.number);
          setPending(data);
    
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  async function getMissing() {
    setLoading(true);
    const date = new Date().toISOString();
    const id = await SecureStore.getItemAsync("id");
    try {
      if (!id) {
        throw new Error('No user logged in');
      } else {
        const { data, error, status } = await supabase
          .from('submissions')
          .select()
          .eq('patientid', id)
          .eq('status', 'FALSE')
          .lt('deadline', date);

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setMissing(data);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

 

  const getUserDetails = async() => {
    setLoading(true);
    const date = new Date().toISOString();
    const id = await SecureStore.getItemAsync("id");
    try {
      if (!id) {
        throw new Error('No user logged in');
      } else {
        const { data, error, status } = await supabase
          .from('users')
          .select("to_submit, total")
          .eq('id', id)
          .single()


        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          calculatePercentage(data.to_submit, data.total)
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const calculatePercentage = (tosubmit:number, total:number) => {

    if(tosubmit != null) {
      const percent = ((total - tosubmit) / total) * 100;
      setPercentage(Math.round(percent * 100) / 100);
      if (percent === 0) {
        setStatus('Get started');
      } else if (percent > 0 && percentage < 50) {
        setStatus('Keep going!');
      } else if (percent === 50) {
        setStatus("You're halfway there!");
      } else if (percent === 100) {
        setStatus('Done!');
      } else {
        setStatus("You're almost there!");
      }
    }
   
  };

  return (
    <>
      <StatusBar style="auto" />

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : pending === undefined ? (
        <></>
      ) : (
        <ScrollView>
          <View style={styles.statuscontainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.statustext, { flex: 2.5 }]}>{status}</Text>
              <View style={{ flex: 1 }}>
                <View style={[styles.percentage, styles.elevation]}>
                  <Text style={styles.status}>{percentage}%</Text>
                </View>
              </View>
            </View>
          </View>
          {/* <View style={[styles.statuscontainer, { flexDirection: 'row', backgroundColor: Palette.focused, padding: 15 }]}>
            <FontAwesome name="exclamation-triangle" size={35} color="red" />
            <Text style={{ fontFamily: 'Heading', fontSize: 20, color: Palette.buttonOrLines, marginLeft: 5 }}>
              You have {missing.length} missing submission/s!
            </Text>
          </View> */}

          <View style={styles.horizontalcontainer}>
            {pending.length > 0 ? (
              <View
                key={pending[0].id}
                style={[styles.colcontainer, { backgroundColor: Palette.shadowAccent }, styles.shadowprop, styles.elevation]}
              >
                <View style={{ backgroundColor: Palette.shadowAccent, flex: 2 }}>
                  <View style={{ flexDirection: 'row', backgroundColor: Palette.shadowAccent, alignItems: 'center' }}>
                    {/* <FontAwesome style={{ marginRight: 10 }} name="tasks" size={24} color={'white'} /> */}
                    <Text style={styles.detailheader}>NEXT SUBMISSION</Text>
                  </View>

                  <Text style={styles.details}>{pending[0].deadline.toString()}</Text>
                </View>
                <Link href={{ pathname: '/submissionbin' , params:{id: pending[0].id, type: "Ongoing"}}} asChild style={styles.button}>
                  <TouchableOpacity>
                    <Text style={styles.buttontext}>Submit</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            ) : (
              <View style={[styles.colcontainer, { backgroundColor: Palette.shadowAccent }, styles.shadowprop, styles.elevation]}>
                <Text>No pending submissions</Text>
              </View>
            )}
            <View style={[styles.colcontainer, { backgroundColor: Palette.buttonOrLines }, styles.shadowprop, styles.elevation]}>
              <View style={{ flexDirection: 'row', backgroundColor: Palette.buttonOrLines, alignItems: 'center' }}>
                {/* <FontAwesome style={{ marginRight: 10 }} name="exclamation-triangle" size={24} color={'white'} /> */}
                <Text style={styles.detailheader}>MISSING SUBMISSIONS</Text>
              </View>
              <Text style={styles.details}>Open to see and submit missed submissions</Text>
              <Link href={{ pathname: '/missingsubmissions' }} asChild style={styles.button}>
                <TouchableOpacity>
                  <Text style={styles.buttontext}>See Submissions</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
          <View style={styles.calendarContainer}>
                <Link href={{pathname: "/schedule"}} asChild>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text style={styles.dashboardText}>APPOINTMENTS</Text> 
                    </TouchableOpacity>
                </Link>
            </View>
            <View style={styles.calendarContainer}>
                <Link href={{pathname: "/history" }} asChild>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text style={styles.dashboardText}>SUBMISSION HISTORY</Text> 
                    </TouchableOpacity>
                </Link>
            </View>
            {/* {session!==null && (
              <Push session={session} />
            )} */}
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  horizontalcontainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'rgba(52, 52, 52, alpha)',
  },
  colcontainer: {
    flex: 1,
    margin: 5,
    padding: 15,
    borderRadius: 15,
  },
  rowcontainer: {
    height: 150,
    alignContent: 'center',
    alignItems: 'center',
    margin: 10,
    padding: 10,
    borderRadius: 15,
  },
  rewardscontainer: {
    borderColor: Palette.buttonOrLines,
    borderWidth: 2,
    margin: 10,
    padding: 20,
    borderRadius: 15,
  },
  percentage: {
    borderRadius: 90,
    height: 100,
    width: 100,
    backgroundColor: Palette.shadowAccent,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Palette.buttonOrLines,
    borderWidth: 4,
  },
  status: {
    fontFamily: 'Heading',
    fontSize: 25,
    color: 'white',
  },
  statustext: {
    fontFamily: 'Heading',
    fontSize: 20,
    alignSelf: 'center',
    marginLeft: 20,
    color: Palette.buttonOrLines,
  },
  statuscontainer: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    alignContent: 'center',
    borderRadius: 15,
  },
  details: {
    fontFamily: 'Poppins',
    fontSize: 16,
    marginTop: 10,
    color: 'white',
  },
  rewardins: {
    fontFamily: 'Poppins',
    fontSize: 16,
    marginTop: 10,
    color: Palette.buttonOrLines,
  },
  shadowprop: {
    shadowColor: 'black',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  elevation: {
    elevation: 10,
    shadowColor: '#52006A',
  },
  rewardsearned: {
    fontFamily: 'Heading',
    fontSize: 20,
    marginLeft: 15,
  },
  reward: {
    fontFamily: 'Subheading',
    fontSize: 20,
  },
  detailheader: {
    fontFamily: 'Heading',
    fontSize: 20,
    color: 'white',
  },
  button: {
    padding: 10,
    borderRadius: 60,
    backgroundColor: Palette.buttonOrLines,
    borderColor: 'white',
    borderWidth: 1,
  },
  buttontext: {
    fontFamily: 'Poppins',
    fontSize: 16,
    alignSelf: 'center',
    color: 'white',
  },
  workerdashboard: {
    fontFamily: 'Heading',
    fontSize: 30,
    color: 'white',
  },
  count: {
    fontFamily: 'Poppins',
    fontSize: 30,
    color: 'white',
  },
  addpatient: {
    alignSelf: 'flex-end',
    position: 'absolute',
    height: 80,
    width: 80,
    backgroundColor: Palette.buttonOrLines,
    borderRadius: 90,
    alignItems: 'center',
    alignContent: 'center',
  },
  dashboardText: {
    flex: 2,
    fontSize: 30,
    color: 'white',
},
calendarContainer: {
    padding: 10,
    backgroundColor: Palette.buttonOrLines,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Palette.background,
    marginHorizontal: 5,
    alignItems: 'center',
    margin: 10,

}, buttonContainer: {
        flex: 1,
        backgroundColor: Palette.buttonOrLines,
        padding: 10,
        borderRadius: 20,
        marginHorizontal: 10,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
