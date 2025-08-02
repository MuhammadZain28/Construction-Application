import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, FlatList, Platform } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { House, Paints } from '../Class/App'; 
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDataContext } from './DataContext';
import Loading from '@/components/Loading';
import { set } from 'firebase/database';

let house = [ new House("All Houses", "All Houses", "", false) ];
export default function TabTwoScreen(Houses: House[]) {
  const { houses, paints, setIsPaintUpdated, loading } = useDataContext();
  const [Form, setForm] = React.useState({
    id: "",
    color: "Paint",
    no: 0,
    price: 0.0,
    home: "All Houses",
    name: "",
    date: new Date(),
  });
  const [ModalType, setModalType] = React.useState("")
  const [id, setId] = React.useState("");
  const [state, setState] = React.useState({
    update: false,
    dropdown: false,
    mobile: false,
    showDate: false,
  });
  const [search, setSearch] = React.useState("");
  React.useEffect(() => {
    
    if (Platform.OS === 'android') {
      setState(prev => ({ ...prev, mobile: true }));
    }
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      house = houses;
    }

    fetchData();
  }, [houses, paints]);

  const handleHouseSelect = (code: string) => {
    setForm(prev => ({ ...prev, home: code }));
    setModalType("");
    setState(prev => ({ ...prev, dropdown: false }));
  }
  const handleMaterialSelect = (id: string) => {
    setForm(prev => ({ ...prev, color: paints.find(p => p.id === id)?.color || "Paint" }));
    setModalType("");
  }

  const handleClick = (id: string, status: boolean) => {
    setIsPaintUpdated(true);
    Paints.UpdateUsed(id, status).catch(console.error);
  };
  
  const addData = async() => {
    await Paints.save(Form.name, Form.color, Form.home, Form.no, Form.price, Form.date.toISOString().substring(0, 10), false);
    setIsPaintUpdated(true);
    setForm(prev => ({
      ...prev,
      price: 0,
      no: 0,
      color: "Paint",
      colorId: "",
      id: "",
      home: "All Houses",
    }));
  }
  const handleDelete = (id: string) => {
    setIsPaintUpdated(true)
    Paints.deletePaint(id)
  };
  const handleUpdate = () => {
    setIsPaintUpdated(true);
    Paints.UpdatePaint(Form.id, Form.name, Form.color, Form.home, Form.no, Form.price, Form.date.toISOString().substring(0, 10));

    setState(prev => ({ ...prev, update: false }));
    setModalType("")
    setForm(prev => ({
      ...prev,
      price: 0,
      no: 0,
      color: "Paint",
      colorId: "",
      id: "",
      home: "All Houses",
    }));
  }

  if (loading) {
    return <Loading />;
  }

  return (

    <ScrollView style={{flex: 1, backgroundColor: '#dbdbdbff', padding: 10}}>
      <View style={styles.header}>
        <View style={[styles.card, {backgroundColor: 'rgba(12, 41, 145, 1)'}]}>
          <View>
            <TouchableOpacity onPress={() => setModalType("Paint")} style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.cardText}>{ Form.color }</Text>
              <MaterialIcons name="keyboard-arrow-down" style={{fontSize: 20, color: 'rgb(255, 255, 255)'}}/>
            </TouchableOpacity>    
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, minWidth: 120, marginInline: 15, marginBlock: 20, backgroundColor: 'rgba(255, 255, 255, 1)', paddingInline: 25, borderRadius: 50}}>
              <Text style={[styles.cardText, {color: 'rgba(12, 41, 145, 1)',}]}>{ Form.color === "Paint" ? paints.length : paints.filter(p => p.color === Form.color).length}</Text>
            </View>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center', gap: 10}}>
            <View style={styles.iconContainer}>
              <MaterialIcons name='format-paint' style={[styles.icon, {color: 'rgba(12, 41, 145, 1)'}]}/>
            </View>
            <TouchableOpacity style={{backgroundColor: 'rgb(255, 255, 255)', width: 170, borderRadius: 20, paddingInline: 15, paddingBlock: 5, alignItems: "center", justifyContent: "center", flexDirection: "row"}}
            onPress={() => setModalType("Form")}>
              <MaterialCommunityIcons name="plus-circle" style={{color: 'rgb(12, 41, 145)', fontSize: 28}}/>
              <Text style={{color: 'rgb(12, 41, 145)', fontSize: 18, fontWeight: "bold"}}> Paint</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.card, {backgroundColor: 'rgba(255, 183, 0, 1)'}]}>
          <View>
            <Text style={styles.cardText}> Spend </Text>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5, marginInline: 5, marginBlock: 20, backgroundColor: 'rgba(255, 255, 255, 1)', paddingInline: 15, borderRadius: 50}}>
              <Text style={[styles.cardText, { color: 'rgba(255, 183, 0, 1)', fontSize: 24 }]}>Rs. {paints.filter(p => p.house === Form.home).reduce((sum, item) => sum + item.price*item.no, 0)}</Text>
            </View>    
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center', gap: 10}}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name='cash-100' style={[styles.icon, {color: 'rgb(255, 183, 0)'}]}/>
            </View>
            <TouchableOpacity style={{backgroundColor: 'rgb(255, 255, 255)', width: 170, borderRadius: 20, paddingInline: 15, paddingBlock: 5, alignItems: "center", justifyContent: "center", flexDirection: "row"}} 
                              onPress={() => setState(prev => ({ ...prev, dropdown: true }))}>
              <MaterialCommunityIcons name="home" style={{color: 'rgb(255, 183, 0)', fontSize: 28, paddingInline: 5,}}/>
              <Text style={{color: 'rgb(255, 183, 0)', fontSize: 18, fontWeight: "bold"}}>
                { house.find(h => Form.home === h.code)?.name || 'All Houses'}
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
      <View style={styles.body}>
        <View style={{flexDirection: "row", justifyContent: "space-between", marginBlock: 10, marginInline: 15}}>
          <Text style={{fontSize:24, fontWeight: 'bold', padding: 5,}}>Paints</Text>
        </View>
        
        <View style={styles.searchBar}>
          <TextInput placeholder='Search....' style={styles.searchInput} value={search} onChangeText={setSearch}/>
          { search.length > 0 &&
            <TouchableOpacity onPress={() => setSearch("")} style={{ position: 'absolute', right: 10}}><MaterialIcons name='close' size={18} color={'rgba(12, 6, 137, 1)'}></MaterialIcons></TouchableOpacity>
          }
          { search.length > 0 &&
            <FlatList 
              data={paints.filter(h => h.name.toLowerCase().includes(search.toLowerCase()) || h.color.toLowerCase().includes(search.toLowerCase()))}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  setForm(prev => ({
                    ...prev,
                    id: item.id,
                    name: item.name,
                    color: item.color,
                    no: item.no,
                    price: item.price,
                    home: item.house,
                  }));
                  setModalType("Form");
                  setState(prev => ({ ...prev, update: true }));
                }}>
                  <Text style={{ padding: 10, fontSize: 16 }}>{item.color} ({item.name})</Text>
                </TouchableOpacity>
              )}
              style={{ position: 'absolute', width: 350, backgroundColor: 'rgba(248, 248, 248, 1)', borderRadius: 10, marginTop: 90, zIndex: 100, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}
            />
          }
        </View>
        <View style={{gap: 15}}>
          {paints.map((paints, index) => ( 

          <TouchableOpacity key={index} style={styles.row} onLongPress={() => {setModalType("Delete"); setId(paints.id);}} onPress={() => {setForm(prev => ({ ...prev, id: paints.id, color: paints.color, name: paints.name, no: paints.no, price: paints.price, home: paints.house })); setModalType("Form"); setState(prev => ({ ...prev, update: true }));}}>
            <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', gap: 15}}>
              <Text style={[styles.data, {fontSize: 22}]}> {paints.house}  </Text>
              {paints.used ?
                <TouchableOpacity style={{padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                onPress={()=> handleClick(paints.id, false)}>
                  <View style={{  backgroundColor: 'rgb(6, 149, 13)', flexDirection: 'row', borderRadius: 15, paddingInline: 5, paddingBlock: 5, justifyContent: 'center', alignItems: 'center'}}>
                    <MaterialIcons name='done' style={{fontSize: 20, color: 'rgb(255, 255, 255)',  paddingLeft: 5}}></MaterialIcons>
                    <Text style={{color: 'rgb(255,255,255)', fontWeight: 'bold', paddingRight: 5}}> Remain</Text>
                  </View>
                </TouchableOpacity> 
                :      
                <TouchableOpacity style={{padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                onPress={()=> handleClick(paints.id, true)}>
                  <View style={{ backgroundColor: 'rgba(255, 183, 0, 1)', flexDirection: 'row', borderRadius: 15, paddingInline: 10, paddingBlock: 5, justifyContent: 'center', alignItems: 'center'}}>
                    <MaterialIcons name='incomplete-circle' style={{fontSize: 20, color: 'rgb(255, 255, 255)', paddingLeft: 2}}></MaterialIcons>
                    <Text style={{color: 'rgb(255,255,255)', fontWeight: 'bold'}}> Finish</Text>
                  </View>
                </TouchableOpacity>
              }
            </View>
              
            <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', paddingInline: 15}}>
              <Text style={[styles.data, {fontSize: 18}]}>{paints.color}   ({paints.name})</Text>
              <Text style={[styles.data, {fontSize: 18}]}> {"Rs. " + paints.price*paints.no}</Text>
            </View> 
            <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', paddingInline: 15}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.data, {fontWeight: 'normal', fontSize: 16}]}>Items : </Text>
                <Text style={[styles.data, {fontWeight: 'normal', fontSize: 16}]} >{paints.no.toString()}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.data, {fontWeight: 'normal', fontSize: 16}]}>Date : </Text>
                <Text style={[styles.data, , {fontWeight: 'normal', fontSize: 16}]}> {paints.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
          ))}
        </View>
  
      </View>
      <Modal
        visible={ModalType !== "" ? true : false}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setModalType("");
        }}>
          {{
            Form:
            <View style={{ flex: 1, justifyContent: 'center', gap: 10, alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={{ width: '80%', maxWidth: 430, backgroundColor: '#fff', padding: 20, borderRadius: 20 }}>
                  <Text style={{display: 'flex', textAlign: 'center',justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: 24, marginBlockEnd: 15}}>
                    <MaterialIcons name='construction' style={{fontSize: 32}}/> Materials
                  </Text>
                <Text style={{ fontSize: 18,display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: 5 }}>
                  <MaterialCommunityIcons name='creative-commons' style={{fontSize: 32}}></MaterialCommunityIcons>  Name</Text>
                <TextInput
                  placeholder="Type here..."
                  value={Form.name}
                  onChangeText={name => setForm(prev => ({ ...prev, name }))}
                  style={{
                    height: 40,
                    borderColor: 'gray',
                    borderBottomWidth: 1,
                    marginBottom: 20,
                    paddingHorizontal: 10,
                    outline: 'none',
                  }}
                />
                <Text style={{ fontSize: 18,display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: 5 }}>
                  <MaterialCommunityIcons name='format-paint' style={{fontSize: 32}}></MaterialCommunityIcons>  Color</Text>
                <TextInput
                  placeholder="Type here..."
                  value={Form.color}
                  onChangeText={color => setForm(prev => ({ ...prev, color }))}
                  style={{
                    height: 40,
                    borderColor: 'gray',
                    borderBottomWidth: 1,
                    marginBottom: 20,
                    paddingHorizontal: 10,
                    outline: 'none',
                  }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <View>
                    <Text style={{ fontSize: 18, display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: 5 }}>
                      <MaterialCommunityIcons name='counter' style={{fontSize: 32}}/>  No of Items</Text>
                    <TextInput
                      placeholder="Type here..."
                      value={Form.no.toString()}
                      onChangeText={(text) => setForm(prev => ({ ...prev, no: parseInt(text) || 0 }))}
                      keyboardType="numeric"
                      style={{
                        height: 40,
                        borderColor: 'gray',
                        borderBottomWidth: 1,
                        marginBottom: 20,
                        paddingHorizontal: 10,
                        outline: 'none',
                      }}
                    />
                  </View>
                  <View>
                    <Text style={{ fontSize: 18, display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: 5 }}>
                      <MaterialIcons name='receipt' style={{fontSize: 32}}></MaterialIcons>  Price</Text>
                    <TextInput
                      placeholder="Type here..."
                      value={Form.price.toString()}
                      onChangeText={(text) => setForm(prev => ({ ...prev, price: parseFloat(text) || 0 }))}
                      style={{
                        height: 40,
                        borderColor: 'gray',
                        borderBottomWidth: 1,
                        marginBottom: 20,
                        paddingHorizontal: 10,
                        outline: 'none',
                      }}
                    />
                  </View>
                </View>
                <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <View style={{flex: 1, marginRight: 25}}>
                    <Text style={{ fontSize: 18, display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: 5 }}>
                      <MaterialIcons name='home' style={{fontSize: 32}}></MaterialIcons>  House</Text>
                      <TouchableOpacity style={{backgroundColor: 'rgb(255, 255, 255)', borderBottomWidth: 1, borderColor: '#000', paddingInline: 15, paddingBlock: 5, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} 
                                      onPress={() => setState(prev => ({ ...prev, dropdown: true }))}>
                      <Text style={{color: 'rgba(0, 0, 0, 1)'}}>
                        { Form.home !== "" ? Form.home : 'All Houses'}
                      </Text>
                      <MaterialIcons name="keyboard-arrow-down" style={{fontSize: 20}}/>
                    </TouchableOpacity>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{ fontSize: 18, display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: 5 }}>
                      <MaterialIcons name='calendar-month' style={{fontSize: 32}}></MaterialIcons>  Date</Text>
                      { !state.mobile ?

                      <input type="date" value={Form.date instanceof Date && !isNaN(Form.date.getTime()) ? Form.date.toISOString().split('T')[0] : ''}
                      onChange={(e) => setForm(prev => ({ ...prev, date: new Date(e.target.value) }))} style={{ borderBottomColor: '#000', height: 30, borderBottomWidth: 1, borderInlineWidth: 0, borderTopWidth: 0, fontFamily: 'Arial'}}/>
                      :
                      <View>
                      <TouchableOpacity style={{backgroundColor: 'rgb(255, 255, 255)', borderBottomWidth: 1, borderColor: '#000', paddingInline: 15, paddingBlock: 5, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} 
                      onPress={() => setState(prev => ({ ...prev, showDate: true }))}>
                      <Text style={{color: 'rgba(0, 0, 0, 1)'}}>
                        {Form.date.toLocaleDateString()}
                      </Text>
                      <MaterialIcons name="keyboard-arrow-down" style={{fontSize: 20}}/>
                    </TouchableOpacity>
                      {state.showDate && (

                        <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setState(prev => ({ ...prev, showDate: false }));
                          if (selectedDate) {
                            setForm(prev => ({ ...prev, date: selectedDate }));
                          }
                        }}
                        />
                      )}
                    </View>
                    }
                  </View>
                </View>
                </View>
                { !state.update ?
                <View>
                  <TouchableOpacity style={{backgroundColor: 'rgba(9, 20, 121, 1)', borderRadius: 15, paddingInline: 10, paddingBlock: 5}}
                  onPress={() => addData()}>
                    <Text style={{textAlign: 'center', color: 'rgb(255, 255, 255)', fontWeight: 900}}>Save</Text>
                  </TouchableOpacity>
                </View>
                :
                <View>
                  <TouchableOpacity style={{backgroundColor: 'rgba(9, 20, 121, 1)', borderRadius: 15, paddingInline: 10, paddingBlock: 5}}
                  onPress={() => handleUpdate()}>
                    <Text style={{textAlign: 'center', color: 'rgb(255, 255, 255)', fontWeight: 900}}>Update</Text>
                  </TouchableOpacity>
                </View>
                }
              </View>
              
              <TouchableOpacity 
              onPress={() =>{ setModalType(""); 
                              setState(prev => ({ ...prev, update: false }));      
                              setForm(prev => ({ ...prev, price: 0, no: 0, color: "Paint", colorId: "", home: "All Houses" }));
              }} style={{borderRadius: 50, backgroundColor: 'rgba(48, 47, 47, 0.51)', justifyContent:'center', alignItems: 'center'}}>
                <MaterialCommunityIcons name='close-thick' style={{ color: '#FFFFFF', textAlign: 'center', fontSize: 32, padding: 10 }}></MaterialCommunityIcons>
              </TouchableOpacity>
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
                                    onPress={() => { setModalType("");
                                                      setForm(prev => ({ ...prev, colorId: "", home: "All Houses", color: "Paint", no: 0, price: 0 }));
                                                      }}>
                    <MaterialIcons name='cancel' style={{ color: 'white', fontSize: 24 }} />
                    <Text style={{color: 'white', fontWeight: "bold"}}>Cancel</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center",}}>
                  <TouchableOpacity style={{ flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center", paddingBlock: 5, paddingInline: 15, borderRadius: 15, backgroundColor: "rgb(255, 50, 10)"}}
                    onPress={() => {
                      handleDelete(id);
                      setModalType("");
                    }}>
                    <MaterialIcons name='delete' style={{ color: 'white', fontSize: 24 }} />
                    <Text style={{color: 'white', fontWeight: "bold"}}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>,
          Paint:
          <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={styles.dropDown}>
              <TouchableOpacity onPress={() => handleMaterialSelect("")}>
                <Text style={{ fontWeight: "bold", fontSize: 24}}>Paint</Text>
              </TouchableOpacity>

              <FlatList
                data={Array.from(new Map(paints.map(item => [item.color, item])).values())}
                keyExtractor={(item) => item.color}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleMaterialSelect(item.id)} style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15,  borderBottomColor: '#ddd', borderBottomWidth: 1,}}>
                    { item.color === Form.color ?
                      <MaterialCommunityIcons name="circle-slice-8" style={{fontSize: 20, color: 'rgba(5, 12, 121, 1)', paddingRight: 10}}/>
                        :
                      <MaterialCommunityIcons name="circle-outline" style={{fontSize: 20, color: 'rgba(5, 12, 121, 1)', paddingRight: 10}}/>
                    }
                    <Text style={{fontSize: 18}}>{item.color}</Text>
                  </TouchableOpacity>
                )}
              />
              </View>
          </View>
          }[ModalType]}
      </Modal>
      <Modal
        visible={state.dropdown}
        animationType='slide'
        transparent={true}
        onRequestClose={() => 
          setState(prev => ({ ...prev, dropdown: false }))
        }>
          <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            
            <View style={styles.dropDown}>
              <TouchableOpacity onPress={() => handleHouseSelect("All Houses")}>
                <Text style={{ fontWeight: "bold", fontSize: 24}}>All Houses</Text>
              </TouchableOpacity>

              <FlatList
                    data={house}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => handleHouseSelect(item.code)} style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15,  borderBottomColor: '#ddd', borderBottomWidth: 1,}}>
                        { item.code === Form.home ?
                        <MaterialCommunityIcons name="circle-slice-8" style={{fontSize: 20, color: 'rgba(5, 12, 121, 1)', paddingRight: 10}}/>
                        :
                        <MaterialCommunityIcons name="circle-outline" style={{fontSize: 20, color: 'rgba(5, 12, 121, 1)', paddingRight: 10}}/>
                        }
                        <Text style={{fontSize: 18}}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
              </View>
          </View>
      </Modal>
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
  dropDown: {
    padding: 10,
    fontSize: 20,
    width: '80%', 
    height: '100%',
    maxWidth: 400,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 10,
    zIndex: 100,
  },
  body: {
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 15,
    paddingBottom: 20,
    marginBlock: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(5, 12, 121, 1)'
  }, 
  heads: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 800,
    marginInline: 10
  }, 
  row: {
    flexDirection: 'column',
    backgroundColor: 'rgba(212, 228, 248, 1)',
    borderRadius: 10,
    padding: 5,
    marginInline: 10,
    gap: 10,
  },
  data: {
    borderWidth: 0,
    outline: 'none',
    fontSize: 16,
    fontWeight: 'bold'
  }, 
  HouseList: {
    position: 'absolute',
    backgroundColor: 'rgba(182, 255, 175, 1)',
    padding: 10,
    borderRadius: 10,
    width: 150, 
    top: -50,
    height: 120,
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
  }
});