import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
export default function Wallet() {
  const [card, setCard] = React.useState(false);
  const [created, setCreated] = React.useState(false);
  const [recordVisible, setRecordVisible] = React.useState(false);  
  return (
    <ScrollView>
        <View style={styles.main}>
          <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 10 }]}>
            <LinearGradient
              colors={['#192f5d', '#3b5998', '#4c669f'  ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              locations={[0, 0.5, 1]}
              style ={styles.card}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Ionicons name="wallet" size={28} color="#fff" />
                  <Text style={styles.head}>Wallet</Text>
                </TouchableOpacity>
                <View>
                  <Text style={styles.text}>Rs. 0</Text>
                </View>
                <View style={styles.container}>
                  <View style={[styles.circle1]} />
                  <View style={[styles.circle2]} />
                </View> 
                <TouchableOpacity style={{ position: 'absolute', top: 90, right: 23, backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingInline: 12, paddingBlock: 5, borderRadius: 50, flexDirection: 'row', alignItems: 'center', gap: 5 }} onPress={() => setCard(true)}>
                  <Ionicons name="add-circle" size={20} color="#fff" />
                  <Text style={{color: 'rgb(255,255,255)', fontWeight: '700'}}>Cash In</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                  <View style={{ flex: 1, alignItems: 'center', gap: 20 }}>
                    <Text style={{textAlign: 'center', color: 'rgb(255, 255, 255)', fontWeight: '700'}}>Monthly In</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Text style={{color: 'rgb(255, 255, 255)'}}>Rs. 0</Text>
                      <View style={{ backgroundColor: 'rgba(10, 255, 10, 0.52)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingInline: 5, borderRadius: 10 }}>
                        <Ionicons name='arrow-up' size={12} color={'rgb(255, 255,255)'}/>
                        <Text style={{color: 'rgb(255,255,255)', fontSize: 12}}> 0</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center', gap: 20 }}>
                    <Text style={{textAlign: 'center', color: 'rgb(255, 255, 255)', fontWeight: '700'}}>Monthly Out</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Text style={{color: 'rgb(255, 255, 255)'}}>Rs. 0</Text>
                      <View style={{ backgroundColor: 'rgba(255, 0, 0, 0.6)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingInline: 5, borderRadius: 10 }}>
                        <Ionicons name='arrow-down' size={12} color={'rgb(255, 255,255)'}/>
                        <Text style={{color: 'rgb(255,255,255)', fontSize: 12}}> 0</Text>
                      </View>
                    </View>
                  </View>
                </View>
            </LinearGradient>
            <TouchableOpacity style={[styles.card, { width: '100%', justifyContent: 'center', alignItems: 'center' }]} onPress={() => setCreated(true)}>
              <Ionicons name='add' size={36}/>
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            <View style={styles.row}>
              <Text style={styles.icon}>Transactions</Text>
              <TouchableOpacity style={[styles.row, { gap: 10, paddingBlock: 10, backgroundColor: 'rgba(0, 35, 123, 1)', borderRadius: 50 }]}>
                <Ionicons name='receipt' color={'rgb(255,255,255)'} size={20}></Ionicons>
                <Text style={{fontSize: 18, fontWeight: '900', color: 'rgb(255,255,255)'}}>Transaction</Text>
              </TouchableOpacity>
            </View>
            <View style={{ gap: 10, marginTop: 10 }}>
              <TouchableOpacity style={[styles.row, { backgroundColor: 'rgba(4, 159, 9, 0.1)', padding: 10, borderRadius: 10 }]}>
                <Text style={{fontSize: 16, color: 'rgba(4, 159, 9, 1)', fontWeight: 700}}>Name</Text>
                <View style={[styles.row, { gap: 10 }]}>
                  <Text style={{color: 'rgba(4, 159, 9, 1)', fontSize: 16, fontWeight: 700}}>Rs. 0</Text>
                  <Ionicons name='arrow-up' size={20} color={'rgba(4, 159, 9, 1)'} />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.row, { backgroundColor: 'rgba(159, 4, 4, 0.1)', padding: 10, borderRadius: 10 }]}>
                <Text style={{fontSize: 16, color: 'rgba(211, 0, 0, 1)', fontWeight: 700}}>Name</Text>
                <View style={[styles.row, { gap: 10 }]}>
                  <Text style={{color: 'rgba(211, 0, 0, 1)', fontSize: 16, fontWeight: 700}}>Rs. 0</Text>
                  <Ionicons name='arrow-down' size={20} color={'rgba(211, 0, 0, 1)'} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.body}>
            <View style={styles.row}>
              <Text style={styles.icon}>Records</Text>
              <TouchableOpacity style={[styles.row, { gap: 10, paddingBlock: 10, backgroundColor: 'rgba(0, 35, 123, 1)', borderRadius: 50 }]} onPress={() => setRecordVisible(true)}>
                <Ionicons name='book' color={'rgb(255,255,255)'} size={20}></Ionicons>
                <Text style={{fontSize: 18, fontWeight: '900', color: 'rgb(255,255,255)'}}>Record</Text>
              </TouchableOpacity>
            </View>
            <View style={{ gap: 10, marginTop: 10 }}>
              <TouchableOpacity style={[styles.row, { backgroundColor: 'rgba(4, 159, 9, 0.1)', padding: 10, borderRadius: 10 }]}>
                <View style={[styles.row, { gap: 10 }]}>
                  <FontAwesome6 name='user-circle' size={30} color={'rgba(4, 159, 9, 1)'} />
                  <Text style={{fontSize: 16, color: 'rgba(4, 159, 9, 1)', fontWeight: 700}}>Name</Text>
                </View>
                <Text style={{color: 'rgba(4, 159, 9, 1)', fontSize: 16, fontWeight: 700}}>Rs. 0</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.row, { backgroundColor: 'rgba(159, 4, 4, 0.1)', padding: 10, borderRadius: 10 }]}>
                <View style={[styles.row, { gap: 10 }]}>
                  <FontAwesome6 name='user-circle' size={30} color={'rgba(211, 0, 0, 1)'} />
                  <Text style={{fontSize: 16, color: 'rgba(211, 0, 0, 1)', fontWeight: 700}}>Name</Text>
                </View>
                <Text style={{color: 'rgba(211, 0, 0, 1)', fontSize: 16, fontWeight: 700}}>Rs. 0</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Modal
          visible={card}
          transparent={true}
          animationType='fade'
          onRequestClose={()=>{
            setCard(false);
          }}>
            <View style={styles.back}>
              <View style={styles.form}>
                <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 24, marginBottom: 20, }}>CASH IN</Text>
                <Text style={[{color: 'rgb(0,0,0)', fontSize: 18, fontWeight: '700'}]}>Cash</Text>
                  <TextInput style={[styles.input, {outline: 'none'}]}/>
                <Text style={[{color: 'rgb(0,0,0)', fontSize: 18, fontWeight: '700'}]}>Reason</Text>
                  <TextInput style={[styles.input, {outline: 'none'}]}/>
                <TouchableOpacity onPress={() => setCard(false)} style={{width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 213, 0, 1)', borderRadius: 20, padding: 10}}>
                  <Text style={styles.text}>Confirm</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
              onPress={() =>{ setCard(false) }} 
              style={{borderRadius: 50, backgroundColor: 'rgba(48, 47, 47, 0.51)', justifyContent:'center', alignItems: 'center',}}>
                <Ionicons name='close' style={{ color: '#ffffffff', textAlign: 'center', fontSize: 32, padding: 10 }}/>
              </TouchableOpacity>
            </View>
        </Modal>
        
        <Modal
          visible={created}
          transparent={true}
          animationType='fade'
          onRequestClose={()=>{
            setCreated(false);
          }}>
            <View style={styles.back}>
              <View style={styles.form}>
                <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 24, marginBottom: 20, }}>WALLET</Text>
                <Text style={[{color: 'rgb(0,0,0)', fontSize: 18, fontWeight: '700'}]}>Name</Text>
                <TextInput style={[styles.input, {outline: 'none'}]}/>
                <Text style={[{color: 'rgb(0,0,0)', fontSize: 18, fontWeight: '700'}]}>Cash In</Text>
                <TextInput style={[styles.input, {outline: 'none'}]}/>
                <Text style={[{color: 'rgb(0,0,0)', fontSize: 18, fontWeight: '700'}]}>House</Text>
                <TouchableOpacity style={[styles.input, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}]}>
                  <Text style={{color: 'rgb(0,0,0)'}}>Select House</Text>
                  <Ionicons name='chevron-down' size={20} color={'rgb(0,0,0)'}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCreated(false)} style={{width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 213, 0, 1)', borderRadius: 20, padding: 10}}>
                  <Text style={styles.text}>Confirm</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
              onPress={() =>{ setCreated(false) }} 
              style={{borderRadius: 50, backgroundColor: 'rgba(48, 47, 47, 0.51)', justifyContent:'center', alignItems: 'center',}}>
                <Ionicons name='close' style={{ color: '#ffffffff', textAlign: 'center', fontSize: 32, padding: 10 }}/>
              </TouchableOpacity>
            </View>
        </Modal>
        
        <Modal
          visible={recordVisible}
          transparent={true}
          animationType='fade'
          onRequestClose={()=>{
            setRecordVisible(false);
          }}>
            <View style={styles.back}>
              <View style={styles.form}>
                <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 24, marginBottom: 20, }}>WALLET</Text>
                <Text style={[{color: 'rgb(0,0,0)', fontSize: 18, fontWeight: '700'}]}>Name</Text>
                <TextInput style={[styles.input, {outline: 'none'}]}/>
                <Text style={[{color: 'rgb(0,0,0)', fontSize: 18, fontWeight: '700'}]}>Cash In</Text>
                <TextInput style={[styles.input, {outline: 'none'}]}/>
                <Text style={[{color: 'rgb(0,0,0)', fontSize: 18, fontWeight: '700'}]}>House</Text>
                <TouchableOpacity style={[styles.input, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}]}>
                  <Text style={{color: 'rgb(0,0,0)'}}>Select House</Text>
                  <Ionicons name='chevron-down' size={20} color={'rgb(0,0,0)'}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setRecordVisible(false)} style={{width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 213, 0, 1)', borderRadius: 20, padding: 10}}>
                  <Text style={styles.text}>Confirm</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
              onPress={() =>{ setRecordVisible(false) }} 
              style={{borderRadius: 50, backgroundColor: 'rgba(48, 47, 47, 0.51)', justifyContent:'center', alignItems: 'center',}}>
                <Ionicons name='close' style={{ color: '#ffffffff', textAlign: 'center', fontSize: 32, padding: 10 }}/>
              </TouchableOpacity>
            </View>
        </Modal>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    backgroundColor: '#a6a6a7ff',
    padding: 20,
    borderRadius: 10,
    margin: 10,
    maxWidth: 450,
    width: '100%',
    height: 225,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 50,
    right: 50,
  },
  circle1: {
    backgroundColor: 'rgba(255, 0, 0, 1)',
    position: 'absolute',
    right: 5,
    width: 70,
    height: 70,
    borderRadius: 75,
  },
  circle2: {
    backgroundColor: 'rgba(255, 170, 0, 1)',
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 75,
  },
  head: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    marginInline: 30,
    fontWeight: 700,
  },
  icon: {
    color: '#000',
    fontSize: 28,
    marginBlock: 10,
    marginInline: 10,
    fontWeight: 'bold', 
  },
  body: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    paddingBlock: 20,
    marginBlock: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }, 
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingInline: 10,
  },
  form: {
    maxWidth: 450,
    width: '80%',
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 20,
    padding: 20, 
  }, 
  back: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  }, 
  input: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
    outline: 'none',
  }
})