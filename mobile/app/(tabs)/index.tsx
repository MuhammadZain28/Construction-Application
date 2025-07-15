import React, { useState, useRef } from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput, Modal, TouchableOpacity, Platform, Animated } from 'react-native';
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import { House } from '../Class/App'

export default function HomeScreen() {
  const [visible, setVisible] = React.useState(false);
  const [mobile, setMobile] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [ deleteVisible, setDelete] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const editRef = useRef(null);
  const animation = useRef(new Animated.Value(0)).current;
  const [home, setHome] = useState([
    new House("ABC", "01", "A Good House", false),
    new House("XYZ", "02", "A Good House", false)
  ]);

  const handleFocus = () => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  const handleBlur = () => {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };
  
  React.useEffect(() => {
    if (Platform.OS === 'android') {
      setMobile(true);
    }
  }, []);
 
  const handleClick = (code: string, status: boolean) => {
  setHome(prev =>
    prev.map(h =>
      h.code === code
        ? new House(h.name, h.code, h.description, status) // status = true
        : h
      )
    );
  };

  const addData = () => {
    const house = new House(name, code, description);
    setHome(prev =>[ ...prev, house]);
  }
  const remove = (code: string) => {
    setHome(prevHomes => prevHomes.filter(h => h.code !== code));
  }
  return (
    <ScrollView>
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.headerText}>House</Text>
        </View>
        <View style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 20}}>
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>House</Text>
            <TouchableOpacity onPress={()=> setVisible(true)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 8, backgroundColor: 'rgb(222, 69, 253)', borderRadius: 20}}>
                <MaterialCommunityIcons name='plus-circle' color={'white'} style={{fontSize: 24, marginRight: 5,}}></MaterialCommunityIcons>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Create House</Text>
              </View>
            </TouchableOpacity>
          </View>
           
          <View>
            {
            home.map((house, index) => (
            <TouchableOpacity key={index} style={{borderColor: 'rgb(214, 71, 243)', borderWidth: 1, borderRadius: 20}} onPress={() => {
                    setName(house.name);
                    setCode(house.code);
                    setDescription(house.description);
                    setVisible(true);
                  } } onLongPress={() => {
                    setDelete(true);
                    setCode(house.code);
                  }}>
              <View style={{flexDirection: 'column', backgroundColor: 'rgb(255, 255, 255)', borderRadius: 20}}>
                <Text style={{padding: 10, fontSize: 18, fontWeight: 'bold'}}> {house.code}</Text>
                <View style={styles.titleContainer}>
                  <Text style={{padding: 10, fontSize: 18, fontWeight: 'bold'}}> {house.name}</Text>
                  { house.completed ?
                    <TouchableOpacity style={{padding: 10,  display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                    onPress={()=> handleClick(house.code, false)}>
                      <View style={{backgroundColor: 'rgb(6, 149, 13)', flexDirection: 'row', borderRadius: 15, paddingInline: 15, paddingBlock: 5, justifyContent: 'center', alignItems: 'center'}}>
                        <MaterialIcons name='done' style={{fontSize: 20, color: 'rgb(255, 255, 255)'}}></MaterialIcons>
                        <Text style={{color: 'rgb(255,255,255)', fontWeight: 'bold'}}> Completed</Text>
                      </View>
                    </TouchableOpacity> 
                    :      
                    <TouchableOpacity style={{padding: 10,  display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                    onPress={()=> handleClick(house.code, true)}>
                      <View style={{backgroundColor: 'rgb(237, 188, 29)', flexDirection: 'row', borderRadius: 15, paddingInline: 15, paddingBlock: 5, justifyContent: 'center', alignItems: 'center'}}>
                        <MaterialIcons name='incomplete-circle' style={{fontSize: 20, color: 'rgb(255, 255, 255)'}}></MaterialIcons>
                        <Text style={{color: 'rgb(255,255,255)', fontWeight: 'bold'}}> Pending</Text>
                      </View>
                    </TouchableOpacity>
                  }
                </View>
                <View style={{width: '15%',padding: 10, borderColor: 'rgb(214, 71, 243)', flexDirection: 'row', justifyContent: 'space-between'}}>
                  <TouchableOpacity onPress={() => remove(house.code)}>
                    <MaterialIcons name='delete' style={{backgroundColor: 'rgb(255, 0, 0)', color: '#fff', fontSize: 24, padding: 5, borderRadius: 50}}></MaterialIcons>
                  </TouchableOpacity>
                  <TouchableOpacity
                  onPress={() => {
                    setName(house.name);
                    setCode(house.code);
                    setDescription(house.description);
                    setVisible(true);
                  } }>
                    <MaterialIcons name='edit' style={{backgroundColor: 'rgb(255, 217, 0)', color: '#fff', fontSize: 24, padding: 5, borderRadius: 50}}></MaterialIcons>
                  </TouchableOpacity>
                  <TouchableOpacity 
                  onPress={() => {
                    setName(house.name);
                    setCode(house.code);
                    setDescription(house.description);
                    setVisible(true);
                  } }>
                    <MaterialIcons name='remove-red-eye' style={{backgroundColor: 'rgb(145, 255, 0)', color: '#fff', fontSize: 24, padding: 5, borderRadius: 50}}></MaterialIcons>
                  </TouchableOpacity>
                </View>
                <Text style={{padding: 10, fontSize: 14,}}> {house.description}</Text>
              </View>
            </TouchableOpacity>
            ))}
          </View> 
          
        </View>
        <Modal
          visible={visible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            setVisible(false);
          }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        
            <TouchableOpacity onPress={() =>{ setVisible(false);}} style={{borderRadius: 50, backgroundColor: 'rgba(48, 47, 47, 0.51)', position: 'absolute', top: 15, justifyContent:'center', alignItems: 'center'}}>
              <MaterialCommunityIcons name='close-thick' style={{ color: '#FFFFFF', textAlign: 'center', top: 6 ,fontSize: 32, width: 50, height: 50 }}></MaterialCommunityIcons>
            </TouchableOpacity>
            <View style={{ width: '80%', maxWidth: 430, backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
                <Text style={{display: 'flex', textAlign: 'center',justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: 24, marginBlockEnd: 15}}>
                  <MaterialCommunityIcons name='home' style={{fontSize: 32}}></MaterialCommunityIcons> House Details
                </Text>   
                { mobile ?
                <View style={{position: 'absolute', right: 10, top: 5, alignItems: 'center', justifyContent: 'center'}}>
                  <Animated.Text  style={{ backgroundColor: 'rgb(255, 213, 0)', color: 'rgb(255, 255, 255)', paddingInline: 10, paddingBlock: 2.5, marginBlock: 2.5, borderRadius: 10, fontWeight: 'bold', transform: [{ scale: animation }], transformOrigin: 'bottom'}}>Enable Edit</Animated.Text>
                  <TouchableOpacity ref={editRef} onFocus={handleFocus} onBlur={handleBlur}>
                    <MaterialIcons name='edit' style={{backgroundColor: 'rgb(255, 217, 0)', color: '#fff', fontSize: 24, padding: 5, borderRadius: 50}}></MaterialIcons>
                  </TouchableOpacity>
                </View> : null
                }
              <Text style={{ fontSize: 18,display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: 5 }}>
                <MaterialCommunityIcons name='language-haskell' style={{fontSize: 32}}></MaterialCommunityIcons>  Code</Text>
              <TextInput
                placeholder="Type here..."
                value={code}
                onChangeText={setCode}
                style={{
                  height: 40,
                  borderColor: 'gray',
                  borderBottomWidth: 1,
                  marginBottom: 20,
                  paddingHorizontal: 10,
                  outline: 'none',
                }}
              />
              <Text style={{ fontSize: 18, display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: 5 }}>
                <MaterialIcons name='location-city' style={{fontSize: 32}}></MaterialIcons>  Name</Text>
              <TextInput
                placeholder="Type here..."
                value={name}
                onChangeText={setName}
                style={{
                  height: 40,
                  borderColor: 'gray',
                  borderBottomWidth: 1,
                  marginBottom: 20,
                  paddingHorizontal: 10,
                  outline: 'none',
                }}
              />
              <Text style={{ fontSize: 18, display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: 5 }}>
                <MaterialIcons name='text-snippet' style={{fontSize: 32}}></MaterialIcons>  Description</Text>
              <TextInput
                placeholder="Type here..."
                value={description}
                onChangeText={setDescription}
                style={{
                  height: 40,
                  borderColor: 'gray',
                  borderBottomWidth: 1,
                  marginBottom: 20,
                  paddingHorizontal: 10,
                  outline: 'none',
                }}
              />
              <View>
                <TouchableOpacity style={{backgroundColor: 'rgb(205, 27, 245)', borderRadius: 15, paddingInline: 10, paddingBlock: 5}}
                onPress={() => addData()}>
                  <Text style={{textAlign: 'center', color: 'rgb(255, 255, 255)', fontWeight: 900}}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
              visible={deleteVisible}
              transparent={true}
              animationType="slide"
              onRequestClose ={() => {
                setDelete(false)
              }}>
              <View style={{ flex: 1, gap: 10, backgroundColor: 'rgba(97, 97, 97, 0.5)' }}>
                <View style={{ width: '100%', backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, bottom: 0, gap: 20, position: "absolute",  justifyContent: "center", alignItems: "center" }}>
                  <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, paddingBottom: 10, flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold"}}>Delete Items</Text>
                  </View>
                  <TouchableOpacity style={{position: "absolute", top: 5, right: 5}} onPress={() => setDelete(false)}>
                    <MaterialIcons name='cancel' style={{ color: 'rgba(54, 57, 55, 1)', fontSize: 24 }} />
                  </TouchableOpacity>
                  <View style={{ width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 }}>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center",}}>
                      <TouchableOpacity style={{ flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center", paddingBlock: 5, paddingInline: 15, borderRadius: 15, backgroundColor: "rgba(60, 94, 245, 1)"}} 
                                        onPress={() => { setDelete(false)}}>
                        <MaterialIcons name='cancel' style={{ color: 'white', fontSize: 24 }} />
                        <Text style={{color: 'white', fontWeight: "bold"}}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center",}}>
                      <TouchableOpacity style={{ flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center", paddingBlock: 5, paddingInline: 15, borderRadius: 15, backgroundColor: "rgb(255, 50, 10)"}}
                        onPress={() => {
                          remove(code);
                          setDelete(false);
                        }}>
                        <MaterialIcons name='delete' style={{ color: 'white', fontSize: 24 }} />
                        <Text style={{color: 'white', fontWeight: "bold"}}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
          </Modal>
          
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  header: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    marginBlockEnd: 40,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  main: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#00000011',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
