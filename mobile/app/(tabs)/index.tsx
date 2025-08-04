import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput, Modal, TouchableOpacity, Platform, Alert, FlatList } from 'react-native';
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import { House } from '../Class/App';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDataContext } from './DataContext';
import Loading from '@/components/Loading';
import Header from '@/components/ui/Header';

export default function HomeScreen() {
  const { houses, materials, paints, loading } = useDataContext();
  const [Form, setForm] = useState({ name: '', code: '', description: '', date: new Date() });
  const [ModalType, setModalType] = useState("");
  const [state, setState] = useState({ visible: false, updateVisible: false, showDate: false, mobile: true });
  const [search, setSearch] = useState("");

  React.useEffect(() => {
    if (Platform.OS === 'web') {
      setState(prevState => ({ ...prevState, mobile: false }));
    }
    else {
      setState(prevState => ({ ...prevState, mobile: true }));
    }
  }, []);
  const onChange = (event: any, date?: Date) => {
    if (date) {
      const strippedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      setForm({ ...Form, date: strippedDate });
      setState(prevState => ({ ...prevState, showDate: false }));
    }
  };

  const handleHouseSelect = (code: string) => {
    setState(prevState => ({ ...prevState, visible: false }));
    setForm({ ...Form, code });
  };
 
  const handleClick = (code: string, status: boolean) => {
    House.updateCompleted(code, status).catch(console.error);
  };

  const addData = () => {
    const house = new House(Form.name, Form.code, Form.description, false, Form.date.toISOString().substring(0, 10));
    House.save(house).then(() => {
      setModalType("");
      setForm({ name: "", code: "All Houses", description: "", date: new Date() });
    }).catch(error => {
      console.error("Error saving house:", error);
    });
    setState(prevState => ({ ...prevState, updateVisible: false }));
  };

  const remove = (code: string) => {
    try {
        House.deleteHouse(code);
        setModalType("");
        setForm({ ...Form, code: "All Houses" });
        Alert.alert(
            'House Deleted',
            'The house has been successfully deleted.',
            [
                {
                    text: 'OK',
                    onPress: () => console.log('House deleted'),
                }
            ]
        );
      }
      catch(error) {
        console.error("Error deleting house:", error);
      }
  };

  const update = () => {
    House.updateHouse(Form.code, new House(Form.name, Form.code, Form.description, false, Form.date.toISOString().substring(0, 10)))
      .then(() => {
        setModalType("");
        setForm({ name: "", code: "All Houses", description: "", date: new Date() });
      })
      .catch(error => {
        console.error("Error updating house:", error);
      });
      setState(prevState => ({ ...prevState, updateVisible: false }));
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView style={{backgroundColor: '#dbdbdbff'}}>
      <Header icon="home" name="Houses"/>
      <View style={styles.main}>
        <View style={styles.header}>
          <View style={[styles.card, {backgroundColor: 'rgba(206, 58, 255, 1)'}]}>
            <View style={{flexDirection: 'column', gap: 25}}>
              <TouchableOpacity onPress={() => setState(prevState => ({ ...prevState, visible: true }))} 
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <Text style={styles.cardText}>{ houses.find(h => h.code === Form.code)?.name || 'Home'}</Text>
                <MaterialIcons name="keyboard-arrow-down" style={{fontSize: 20, color: 'rgb(255, 255, 255)'}}/>
              </TouchableOpacity>    
              <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginInline: 10,}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginInline: 10, paddingInline: 15, backgroundColor: 'rgba(255, 255, 255, 1)', paddingBlock: 5, borderRadius: 20}}>
                  <Text style={{fontSize: 18, fontWeight: 'bold', color: 'rgba(205, 58, 255, 1)',  width: 75}}>Material</Text>                
                  <Text style={{fontSize: 18, fontWeight: 'bold', color: 'rgba(205, 58, 255, 1)', }}>:</Text>                
                  <Text style={{fontSize: 18, fontWeight: 'bold', color: 'rgba(205, 58, 255, 1)', }}>{materials.filter(m => m.house === Form.code).length}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginInline: 10, paddingInline: 15, backgroundColor: 'rgba(255, 255, 255, 1)', paddingBlock: 5, borderRadius: 20}}>
                  <Text style={{fontSize: 18, fontWeight: 'bold', color: 'rgba(205, 58, 255, 1)', width: 75}}>Paint</Text>  
                  <Text style={{fontSize: 18, fontWeight: 'bold', color: 'rgba(205, 58, 255, 1)', }}>:</Text>                
                  <Text style={{fontSize: 18, fontWeight: 'bold', color: 'rgba(205, 58, 255, 1)', }}>{paints.filter(p => p.house === Form.code).length}</Text>
                </View>
              </View>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center', gap: 10}}>
              <View style={styles.iconContainer}>
                <MaterialIcons name='home' style={[styles.icon, {color: 'rgba(206, 58, 255, 1)'}]}/>
              </View>
            </View>
          </View>
          <View style={[styles.card, {backgroundColor: 'rgba(255, 183, 0, 1)'}]}>
            <View style={{flexDirection: 'column', gap: 20}}>
              <Text style={styles.cardText}> Spend </Text>
              <View style={{flexDirection: 'row', alignItems: 'center', marginInline: 20, justifyContent: 'space-between', gap: 10, backgroundColor: 'rgba(255, 255, 255, 1)', paddingInline: 10, paddingBlock: 5, borderRadius: 20}}>
                <Text style={{fontSize: 24, fontWeight: 'bold', color: 'rgba(255, 183, 0, 1)', paddingInline: 15,}}>Rs.</Text>  
                <Text style={{fontSize: 24, fontWeight: 'bold', color: 'rgba(255, 183, 0, 1)', paddingInline: 15,}}>{materials.filter(m => m.house === Form.code).reduce((acc, curr) => acc + curr.price*curr.no, 0) + paints.filter(p => p.house === Form.code).reduce((acc, curr) => acc + curr.price*curr.no, 0)}</Text>
              </View>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center', gap: 10}}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name='cash-100' style={[styles.icon, {color: 'rgba(255, 183, 0, 1)'}]}/>
              </View>
            </View>
          </View>
        </View>        
        <View style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',  padding: 20}}>
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>House</Text>
            <TouchableOpacity onPress={()=> setModalType("Form")} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 0, backgroundColor: 'rgb(222, 69, 253)', borderRadius: 20}}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 8, backgroundColor: 'rgb(222, 69, 253)', borderRadius: 20}}>
                <MaterialCommunityIcons name='plus-circle' color={'white'} style={{fontSize: 24, marginRight: 5,}}></MaterialCommunityIcons>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Create House</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.searchBar}>
            <TextInput placeholder='Search....' style={styles.searchInput} value={search} onChangeText={setSearch}/>
            { search.length > 0 &&
              <TouchableOpacity onPress={() => setSearch("")} style={{ position: 'absolute', right: 10}}><MaterialIcons name='close' size={18} color={'rgba(198, 10, 250, 1)'}></MaterialIcons></TouchableOpacity>
            }
            { search.length > 0 &&
              <FlatList 
                data={houses.filter(h => h.name.toLowerCase().includes(search.toLowerCase()) || h.code.toLowerCase().includes(search.toLowerCase()))}
                keyExtractor={(item) => item.code}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => {
                    setForm({ ...Form, name: item.name, code: item.code, description: item.description, date: new Date(item.date) });
                    setState(prevState => ({ ...prevState, visible: true, updateVisible: true }));
                  }}>
                    <Text style={{ padding: 10, fontSize: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>{item.name} ({item.code})</Text>
                  </TouchableOpacity>
                )}
                style={{ position: 'absolute', width: 350, backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: 10, top: 50, zIndex: 100, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}
              />
            }
          </View>
           
          <View>
            {
            houses.filter(h => h.code !== "All Houses").map((house, index) => (
            <TouchableOpacity key={index} onPress={() => {
                    setForm({ ...Form, name: house.name, code: house.code, description: house.description, date: new Date(house.date) });
                    setModalType("Form");
                    setState(prevState => ({ ...prevState, updateVisible: true }));
                  } } 
                  onLongPress={() => {
                    setModalType("Delete");
                    setForm({ ...Form, code: house.code });
                  }}>
              <View style={{flexDirection: 'column', borderRadius: 20, gap: 10, backgroundColor: 'rgba(245, 212, 252, 1)', padding: 10, marginInline: 10, marginBottom: 10}}>
                <View style={styles.titleContainer}>
                  <Text style={{fontSize: 24, fontWeight: 'bold'}}> {house.code}</Text>
                  <Text style={{fontSize: 14}}>Date: {house.date}</Text>
                </View>
                <View style={[styles.titleContainer, {paddingInline: 10}]}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}> {house.name}</Text>
                  { house.completed ?
                    <TouchableOpacity style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                    onPress={()=> handleClick(house.code, false)}>
                      <View style={{backgroundColor: 'rgb(6, 149, 13)', flexDirection: 'row', borderRadius: 15, paddingInline: 15, paddingBlock: 5, justifyContent: 'center', alignItems: 'center'}}>
                        <MaterialIcons name='done' style={{fontSize: 20, color: 'rgb(255, 255, 255)'}}></MaterialIcons>
                        <Text style={{color: 'rgb(255,255,255)', fontWeight: 'bold'}}> Completed</Text>
                      </View>
                    </TouchableOpacity> 
                    :      
                    <TouchableOpacity style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                    onPress={()=> handleClick(house.code, true)}>
                      <View style={{backgroundColor: 'rgba(255, 183, 0, 1)', flexDirection: 'row', borderRadius: 15, paddingInline: 15, paddingBlock: 5, justifyContent: 'center', alignItems: 'center'}}>
                        <MaterialIcons name='incomplete-circle' style={{fontSize: 20, color: 'rgb(255, 255, 255)'}}></MaterialIcons>
                        <Text style={{color: 'rgb(255,255,255)', fontWeight: 'bold'}}> Pending</Text>
                      </View>
                    </TouchableOpacity>
                  }
                </View>
                <Text style={{fontSize: 14, paddingInline: 10}}> {house.description}</Text>
              </View>
            </TouchableOpacity>
            ))}
          </View> 
          
        </View>
        <Modal
          visible={ModalType !== ""}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            setModalType("");
          }}>
          {{
            Form:
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>

                <TouchableOpacity onPress={() =>{ setModalType("");}} style={{borderRadius: 50, backgroundColor: 'rgba(48, 47, 47, 0.51)', position: 'absolute', top: 15, justifyContent:'center', alignItems: 'center'}}>
                  <MaterialCommunityIcons name='close-thick' style={{ color: '#FFFFFF', textAlign: 'center', top: 6 ,fontSize: 32, width: 50, height: 50 }}></MaterialCommunityIcons>
                </TouchableOpacity>
                <View style={{ width: '80%', maxWidth: 430, backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
                  <Text style={{display: 'flex', textAlign: 'center',justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: 24, marginBlockEnd: 15}}>
                    <MaterialCommunityIcons name='home' style={{fontSize: 32}}></MaterialCommunityIcons> House Details
                  </Text>   
                  <Text style={{ fontSize: 18,display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: 5 }}>
                    <MaterialCommunityIcons name='language-haskell' style={{fontSize: 32}}></MaterialCommunityIcons>  Code</Text>
                  <TextInput
                    placeholder="Type here..."
                    value={Form.code}
                    onChangeText={text => setForm({ ...Form, code: text })}
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
                    value={Form.name}
                    onChangeText={text => setForm({ ...Form, name: text })}
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
                    value={Form.description}
                    onChangeText={text => setForm({ ...Form, description: text })}
                    style={{
                      height: 40,
                      borderColor: 'gray',
                      borderBottomWidth: 1,
                      marginBottom: 20,
                      paddingHorizontal: 10,
                      outline: 'none',
                    }}
                  />
                  <View style={{marginBottom: 20}}>
                    <Text style={{ fontSize: 18, display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: 5 }}>
                      <MaterialIcons name='calendar-month' style={{fontSize: 32}}></MaterialIcons>  Date</Text>
                      { !state.mobile ?

                      <input type="date" value={Form.date instanceof Date && !isNaN(Form.date.getTime()) ? Form.date.toISOString().split('T')[0] : ''}
                      onChange={(e) => setForm({ ...Form, date: new Date(e.target.value) })} style={{ borderBottomColor: '#000', height: 30, borderBottomWidth: 1, borderInlineWidth: 0, borderTopWidth: 0, fontFamily: 'Arial'}}/>
                      :
                      <View>
                      <TouchableOpacity style={{backgroundColor: 'rgb(255, 255, 255)', borderBottomWidth: 1, borderColor: '#000', paddingInline: 15, paddingBlock: 5, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} 
                      onPress={() => setState(prevState => ({ ...prevState, showDate: true }))}>
                      <Text style={{color: 'rgba(0, 0, 0, 1)'}}>
                        {Form.date.toLocaleDateString()}
                      </Text>
                      <MaterialIcons name="keyboard-arrow-down" style={{fontSize: 20}}/>
                    </TouchableOpacity>
                      {state.showDate && (

                        <DateTimePicker
                        value={new Date(Form.date)}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => onChange(event, selectedDate)}
                        />
                      )}
                    </View>
                    }
                  </View>
                  <View>
                    { state.updateVisible ?
                    <TouchableOpacity style={{backgroundColor: 'rgb(205, 27, 245)', borderRadius: 15, paddingInline: 10, paddingBlock: 5}}
                    onPress={() => update()}>
                      <Text style={{textAlign: 'center', color: 'rgb(255, 255, 255)', fontWeight: 900}}>Update</Text>
                    </TouchableOpacity>

                    :
                    
                    <TouchableOpacity style={{backgroundColor: 'rgb(205, 27, 245)', borderRadius: 15, paddingInline: 10, paddingBlock: 5}}
                    onPress={() => addData()}>
                      <Text style={{textAlign: 'center', color: 'rgb(255, 255, 255)', fontWeight: 900}}>Save</Text>
                    </TouchableOpacity>
                    }
                  </View>
                </View>
              </View>,
            Delete:
              <View style={{ flex: 1, gap: 10, backgroundColor: 'rgba(97, 97, 97, 0.5)' }}>
                <View style={{ width: '100%', backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, bottom: 0, gap: 20, position: "absolute",  justifyContent: "center", alignItems: "center" }}>
                  <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, paddingBottom: 10, flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold"}}>Delete Items</Text>
                  </View>
                  <TouchableOpacity style={{position: "absolute", top: 5, right: 5}} onPress={() => setModalType("")}>
                    <MaterialIcons name='cancel' style={{ color: 'rgba(54, 57, 55, 1)', fontSize: 24 }} />
                  </TouchableOpacity>
                  <View style={{ width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 }}>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center",}}>
                      <TouchableOpacity style={{ flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center", paddingBlock: 5, paddingInline: 15, borderRadius: 15, backgroundColor: "rgba(60, 94, 245, 1)"}} 
                                        onPress={() => { setModalType("")}}>
                        <MaterialIcons name='cancel' style={{ color: 'white', fontSize: 24 }} />
                        <Text style={{color: 'white', fontWeight: "bold"}}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center",}}>
                      <TouchableOpacity style={{ flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center", paddingBlock: 5, paddingInline: 15, borderRadius: 15, backgroundColor: "rgb(255, 50, 10)"}}
                        onPress={() => {
                          remove(Form.code);
                          setModalType("");
                        }}>
                        <MaterialIcons name='delete' style={{ color: 'white', fontSize: 24 }} />
                        <Text style={{color: 'white', fontWeight: "bold"}}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
          }[ModalType]}
        </Modal>

  
        <Modal
          visible={state.visible}
          animationType='slide'
          transparent={true}
          onRequestClose={() => 
            setState(prevState => ({ ...prevState, visible: false }))
          }>
            <View style={{justifyContent: 'flex-start', alignItems: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={styles.dropdown}>
                <TouchableOpacity onPress={() => handleHouseSelect("")}>
                  <Text style={{ fontWeight: "bold", fontSize: 24}}>Home</Text>
                </TouchableOpacity>
                <FlatList
                      data={houses}
                      keyExtractor={(item) => item.name}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleHouseSelect(item.code)} style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15,  borderBottomColor: '#ddd', borderBottomWidth: 1,}}>
                          { item.code === Form.code ?
                          <MaterialCommunityIcons name="circle-slice-8" style={{fontSize: 20, color: 'rgb(7, 180, 48)', paddingRight: 10}}/>
                          :
                          <MaterialCommunityIcons name="circle-outline" style={{fontSize: 20, color: 'rgb(7, 180, 48)', paddingRight: 10}}/>
                          }
                          <Text style={{fontSize: 18}}>{item.name}</Text>
                        </TouchableOpacity>
                      )}
                    />
                </View>
            </View>
        </Modal>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingBlock: 20,
  },
  card: {
    flex: 1,
    minWidth: 300,
    minHeight: 170,
    padding: 10,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'rgb(255, 255, 255)',
  },
  iconContainer: {
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 50,
    padding: 20,
  },
  icon: {
    fontSize: 46
  },
  headerText: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  main: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#efefefff',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 0,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#f1f1f1ff',
    marginInline: 20,
    marginBottom: 10,
    maxWidth: 350,
    borderColor: '#000',
    borderWidth: 1,
    zIndex: 2,
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    padding: 10,
    borderRadius: 20,
    outline: '0px solid transparent',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    maxWidth: 400,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.258,
    shadowRadius: 4,
    elevation: 2,
  }
});