import { TextInput, Text, View, ScrollView, StyleSheet, TouchableOpacity, FlatList, Modal, Platform } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Material, House } from "../Class/App";
import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDataContext } from "./DataContext";

let house: House[] = [];
const Home: React.FC = () => {
  const {houses, materials} = useDataContext();
  const [isDropdownVisible, setDropdownVisible] = React.useState(false);
  const [updateVisible, setUpdateVisible] = React.useState(false); 
  const [visible, setVisible] = React.useState(false);
  const [deleteVisible, setDelete] = React.useState(false);
  const [productId, setProductId] = React.useState("");
  const [mDropDown, setMDropDown] = React.useState(false);
  const [id, setId] = React.useState("");
  const [product, setProduct] = React.useState("Material");
  const [no, setNo] = React.useState(0);
  const [price, setPrice] = React.useState(0.0);
  const [home, setHome] = React.useState("");
  const [date, setDate] = React.useState(new Date());
  const [showDate, setShowDate] = React.useState(false);
  const [mobile, setMobile] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const onChange = (event: any, date?: Date) => {
    if (date) {
      const strippedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      setDate(strippedDate);
      setShowDate(false);
    }
  };
  React.useEffect(() => {
    
    if (Platform.OS === 'android') {
      setMobile(true);
    } 
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      house = houses;
      setMaterial(materials);
    };
    fetchData();
  }, [houses, materials]);
  
  const toggleDropdown = () => setDropdownVisible(prev => !prev);
  const toggleMaterialDropdown = () => setMDropDown(prev => !prev);

  const handleHouseSelect = (code: string) => {
    setHome(code);
    toggleDropdown();
  }
  const handleMaterialSelect = (id: string) => {
    setProduct(material.find(m => m.id === id)?.product || "Material");
    toggleMaterialDropdown()
  }
  const [material, setMaterial] = React.useState<Material[]>([]);

  const handleClick = (id: string, status: boolean) => {
    setMaterial(prev =>
      prev.map(m =>
        m.id === id
          ? new Material(m.id, m.house, m.product, m.no, m.price, m.date, status) 
          : m
        )
      );
    Material.UpdateUsed(id, status).catch(console.error);
  };
  
  const addData = async() => {
    const id = await Material.save(home, product, no, price, date.toISOString().substring(0, 10), false);
    const data = new Material(id, home, product, no, price, date.toISOString().substring(0, 10), false);
    setMaterial(prev => [ ...prev, data]);
    setPrice(0);
    setNo(0);
    setProduct("Material");
    setProductId("");
    setHome("");
  }
  const handleDelete = (id: string) => {
    setMaterial(prev => prev.filter(m => m.id !== id));
  };
  const handleUpdate = () => {
    setMaterial(prev =>
      prev.map(m =>
        m.id === productId
          ? new Material(m.id, home, product, no, price, date.toLocaleString().substring(0, 10), m.used) 
          : m
      )
    );
    Material.UpdateMaterial(productId, home, product, no, price, date.toLocaleString().substring(0, 10));
    
    setUpdateVisible(false);
    setVisible(false);
    setPrice(0);
    setNo(0);
    setProduct("Material");
    setProductId("");
    setHome("");
  };
  return (
    <ScrollView>
      <View style={styles.header}>
        <View style={[styles.card, {backgroundColor: 'rgb(7, 180, 48)'}]}>
          <View>
            <TouchableOpacity onPress={() => toggleMaterialDropdown()} style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.cardText}>{ product }</Text>
              <MaterialIcons name="keyboard-arrow-down" style={{fontSize: 20, color: 'rgb(255, 255, 255)'}}/>
            </TouchableOpacity>    
                    
            <Text style={styles.cardText}>{ product === "Material" ? material.length : material.filter(m => m.product === product).length}</Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center', gap: 10}}>
            <View style={styles.iconContainer}>
              <MaterialIcons name='construction' style={[styles.icon, {color: 'rgb(7, 180, 48)'}]}/>
            </View>
            <TouchableOpacity style={{backgroundColor: 'rgb(255, 255, 255)', width: 170, borderRadius: 20, paddingInline: 15, paddingBlock: 5, alignItems: "center", justifyContent: "center", flexDirection: "row"}}
            onPress={() => setVisible(true)}>
              <MaterialCommunityIcons name="plus-circle" style={{color: 'rgb(7, 180, 48)', fontSize: 28}}/>
              <Text style={{color: 'rgb(7, 180, 48)', fontSize: 18, fontWeight: "bold"}}> Material</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.card, {backgroundColor: 'rgb(255, 208, 0)'}]}>
          <View>
            <Text style={styles.cardText}> Spend </Text>            
            <Text style={styles.cardText}> {material.reduce((sum, item) => sum + item.price*item.no, 0)}</Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center', gap: 10}}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name='cash-100' style={[styles.icon, {color: 'rgb(255, 208, 0)'}]}/>
            </View>
            <TouchableOpacity style={{backgroundColor: 'rgb(255, 255, 255)', width: 170, borderRadius: 20, paddingInline: 15, paddingBlock: 5, alignItems: "center", justifyContent: "center", flexDirection: "row"}} 
                              onPress={toggleDropdown}>
              <MaterialCommunityIcons name="home" style={{color: 'rgb(255, 208, 0)', fontSize: 28, paddingInline: 5,}}/>
              <Text style={{color: 'rgb(255, 208, 0)', fontSize: 18, fontWeight: "bold"}}>
                { house.find(h=>home === h.code)?.name || 'All Houses'}
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
      <View style={styles.body}>
        <View style={{flexDirection: "row", justifyContent: "space-between", marginBlock: 10,}}>
          <Text style={{fontSize:24, fontWeight: 'bold', paddingInline: 20}}>Material</Text>
        </View>

        <View style={styles.searchBar}>
          <TextInput placeholder='Search....' style={styles.searchInput} value={search} onChangeText={setSearch}/>
          { search.length > 0 &&
            <TouchableOpacity onPress={() => setSearch("")} style={{ position: 'absolute', right: 10}}><MaterialIcons name='close' size={18} color={'rgba(2, 144, 59, 1)'}></MaterialIcons></TouchableOpacity>
          }
          { search.length > 0 &&
            <FlatList 
              data={material.filter(h => h.product.toLowerCase().includes(search.toLowerCase()))}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  setProduct(item.product);
                  setNo(item.no);
                  setPrice(item.price);
                  setHome(item.house);
                  setDate(new Date(item.date));
                  setVisible(true);
                  setUpdateVisible(true);
                }}>
                  <Text style={{ padding: 10, fontSize: 16 }}>{item.product}</Text>
                </TouchableOpacity>
              )}
              style={{ position: 'absolute', width: 350, backgroundColor: 'rgba(248, 248, 248, 1)', borderRadius: 10, marginTop: 90, zIndex: 100, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}
            />
          }
        </View>
        
        <View style={{gap: 5}}>
          {material.map((materials, index) => ( 

          <TouchableOpacity key={index} style={styles.row} onLongPress={() => {setDelete(true); setId(materials.id);}} onPress={() => {setProductId(materials.id); setProduct(materials.product); setNo(materials.no); setPrice(materials.price); setHome(materials.house); setVisible(true); setUpdateVisible(true); setDate(new Date(materials.date));}}>
            <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', gap: 15}}>
              <Text style={[styles.data, {fontSize: 22}]}> {house.find(h=>h.code === materials.house)?.name || 'All Houses'}  </Text>
              {materials.used ?
                <TouchableOpacity style={{padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                onPress={()=> handleClick(materials.id, false)}>
                  <View style={{ backgroundColor: 'rgb(6, 149, 13)', flexDirection: 'row', borderRadius: 15, paddingInline: 5, paddingBlock: 5, justifyContent: 'center', alignItems: 'center'}}>
                    <MaterialIcons name='done' style={{fontSize: 20, color: 'rgb(255, 255, 255)',  paddingLeft: 5}}></MaterialIcons>
                    <Text style={{color: 'rgb(255,255,255)', fontWeight: 'bold', paddingRight: 5}}> Remain</Text>
                  </View>
                </TouchableOpacity> 
                :      
                <TouchableOpacity style={{padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                onPress={()=> handleClick(materials.id, true)}>
                  <View style={{ backgroundColor: 'rgb(237, 188, 29)', flexDirection: 'row', borderRadius: 15, paddingInline: 10, paddingBlock: 5, justifyContent: 'center', alignItems: 'center'}}>
                    <MaterialIcons name='incomplete-circle' style={{fontSize: 20, color: 'rgb(255, 255, 255)', paddingLeft: 2}}></MaterialIcons>
                    <Text style={{color: 'rgb(255,255,255)', fontWeight: 'bold'}}> Finish</Text>
                  </View>
                </TouchableOpacity>
              }
            </View>
              
            <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', paddingInline: 15}}>
              <Text style={[styles.data, {fontSize: 18}]}>{materials.product}</Text>
              <Text style={[styles.data, {fontSize: 18}]}> {"Rs. " + materials.price*materials.no}</Text>
            </View> 
            <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', paddingInline: 15}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.data, {fontWeight: 'normal', fontSize: 16}]}>Items : </Text>
                <Text style={[styles.data, {fontWeight: 'normal', fontSize: 16}]} >{materials.no.toString()}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.data, {fontWeight: 'normal', fontSize: 16}]}>Date : </Text>
                <Text style={[styles.data, , {fontWeight: 'normal', fontSize: 16}]}> {materials.date}</Text>
              </View>
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
        <View style={{ flex: 1, justifyContent: 'center', gap: 10, alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ width: '80%', maxWidth: 430, backgroundColor: '#fff', padding: 20, borderRadius: 20 }}>
              <Text style={{display: 'flex', textAlign: 'center',justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: 24, marginBlockEnd: 15}}>
                <MaterialIcons name='construction' style={{fontSize: 32}}/> Materials
              </Text>
            <Text style={{ fontSize: 18,display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: 5 }}>
              <MaterialCommunityIcons name='cart-plus' style={{fontSize: 32}}></MaterialCommunityIcons>  Product</Text>
            <TextInput
              placeholder="Type here..."
            value={product}
            onChangeText={setProduct}
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
              <MaterialCommunityIcons name='counter' style={{fontSize: 32}}/>  No of Items</Text>
            <TextInput
              placeholder="Type here..."
              value={no.toString()}
              onChangeText={(text) => setNo(parseInt(text) || 0)}
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
            <Text style={{ fontSize: 18, display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: 5 }}>
              <MaterialIcons name='receipt' style={{fontSize: 32}}></MaterialIcons>  Price</Text>
            <TextInput
              placeholder="Type here..."
              value={price.toString()}
              onChangeText={(text) => setPrice(parseFloat(text) || 0)}
              style={{
                height: 40,
                borderColor: 'gray',
                borderBottomWidth: 1,
                marginBottom: 20,
                paddingHorizontal: 10,
                outline: 'none',
              }}/>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <View style={{flex: 1, marginRight: 25}}>
                <Text style={{ fontSize: 18, display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: 5 }}>
                  <MaterialIcons name='home' style={{fontSize: 32}}></MaterialIcons>  House</Text>
                  <TouchableOpacity style={{backgroundColor: 'rgb(255, 255, 255)', borderBottomWidth: 1, borderColor: '#000', paddingInline: 15, paddingBlock: 5, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} 
                                  onPress={toggleDropdown}>
                  <Text style={{color: 'rgba(0, 0, 0, 1)'}}>
                    { house.find(h=> h.code === home)?.name || 'All Houses'}
                  </Text>
                  <MaterialIcons name="keyboard-arrow-down" style={{fontSize: 20}}/>
                </TouchableOpacity>
    

              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: 5 }}>
                  <MaterialIcons name='calendar-month' style={{fontSize: 32}}></MaterialIcons>  Date</Text>
                  { !mobile ?

                  <input type="date" value={date instanceof Date && !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : ''}
                  onChange={(e) => setDate(new Date(e.target.value))} style={{ borderBottomColor: '#000', height: 30, borderBottomWidth: 1, borderInlineWidth: 0, borderTopWidth: 0, fontFamily: 'Arial'}}/>
                  :
                  <View>
                  <TouchableOpacity style={{backgroundColor: 'rgb(255, 255, 255)', borderBottomWidth: 1, borderColor: '#000', paddingInline: 15, paddingBlock: 5, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} 
                  onPress={() => setShowDate(true)}>
                  <Text style={{color: 'rgba(0, 0, 0, 1)'}}>
                    {date.toLocaleDateString()}
                  </Text>
                  <MaterialIcons name="keyboard-arrow-down" style={{fontSize: 20}}/>
                </TouchableOpacity>
                  {showDate && (

                    <DateTimePicker
                    value={new Date(date)}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => onChange(event, selectedDate)}/>
                  )}
                </View>
                }
              </View>
            </View>

            
            { !updateVisible ? 
            <View>
              <TouchableOpacity style={{backgroundColor: 'rgb(26, 153, 12)', borderRadius: 15, paddingInline: 10, paddingBlock: 5}}
              onPress={() => addData()}>
                <Text style={{textAlign: 'center', color: 'rgb(255, 255, 255)', fontWeight: 900}}>Save</Text>
              </TouchableOpacity>
            </View>
            :
            <View>
              <TouchableOpacity style={{backgroundColor: 'rgb(26, 153, 12)', borderRadius: 15, paddingInline: 10, paddingBlock: 5}}
              onPress={() => handleUpdate()}>
                <Text style={{textAlign: 'center', color: 'rgb(255, 255, 255)', fontWeight: 900}}>Update</Text>
              </TouchableOpacity>
            </View>
            }
          </View>
          
          <TouchableOpacity 
          onPress={() =>{ setVisible(false); 
                          setUpdateVisible(false);      
                          setPrice(0);
                          setNo(0);
                          setProduct("Material");
                          setProductId("");
                          setHome("");
          }} style={{borderRadius: 50, backgroundColor: 'rgba(48, 47, 47, 0.51)', justifyContent:'center', alignItems: 'center'}}>
            <MaterialCommunityIcons name='close-thick' style={{ color: '#FFFFFF', textAlign: 'center', fontSize: 32, padding: 10 }}></MaterialCommunityIcons>
          </TouchableOpacity>
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
                                    onPress={() => { setDelete(false);
                                                      setProductId("");
                                                      setHome("");
                                                      setProduct("Material");
                                                      setNo(0);
                                                      setPrice(0);}}>
                    <MaterialIcons name='cancel' style={{ color: 'white', fontSize: 24 }} />
                    <Text style={{color: 'white', fontWeight: "bold"}}>Cancel</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center",}}>
                  <TouchableOpacity style={{ flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center", paddingBlock: 5, paddingInline: 15, borderRadius: 15, backgroundColor: "rgb(255, 50, 10)"}}
                    onPress={() => {
                      handleDelete(id);
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

      <Modal
        visible={isDropdownVisible}
        animationType='slide'
        transparent={true}
        onRequestClose={() => 
          setDropdownVisible(false)
        }>
          <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={styles.dropDown}>
              <TouchableOpacity onPress={() => handleHouseSelect("")}>
                <Text style={{ fontWeight: "bold", fontSize: 24}}>Home</Text>
              </TouchableOpacity>


              <FlatList
                    data={house}
                    keyExtractor={(item) => item.name}
                    style={styles.dropDown}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => handleHouseSelect(item.code)} style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15,  borderBottomColor: '#ddd', borderBottomWidth: 1,}}>
                        { item.code === home ?
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
      <Modal
        visible={mDropDown}
        animationType='slide'
        transparent={true}
        onRequestClose={() => 
          setDropdownVisible(false)
        }>
          <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={styles.dropDown}>
              <TouchableOpacity onPress={() => handleMaterialSelect("")}>
                <Text style={{ fontWeight: "bold", fontSize: 24}}>Material</Text>
              </TouchableOpacity>

              <FlatList
                data={material}
                keyExtractor={(item) => item.product}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleMaterialSelect(item.id)} style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15,  borderBottomColor: '#ddd', borderBottomWidth: 1,}}>
                    { item.product === product ?
                      <MaterialCommunityIcons name="circle-slice-8" style={{fontSize: 20, color: 'rgb(7, 180, 48)', paddingRight: 10}}/>
                        :
                      <MaterialCommunityIcons name="circle-outline" style={{fontSize: 20, color: 'rgb(7, 180, 48)', paddingRight: 10}}/>
                    }
                    <Text style={{fontSize: 18}}>{item.product}</Text>
                  </TouchableOpacity>
                )}
              />
              </View>
          </View>
      </Modal>
    </ScrollView>
  );
}
export default Home;

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
    shadowOpacity: 0.128,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 24,
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
    backgroundColor: 'rgb(255, 255, 255)',
    width: '80%',
    height: '100%',
    maxWidth: 400,
    borderRadius: 10,
    zIndex: 100,
  },
  body: {
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.128,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: 'rgb(7, 180, 48)'
  }, 
  heads: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 800,
    marginInline: 10
  }, 
  row: {
    flexDirection: 'column',
    backgroundColor: 'rgb(229, 248, 212)',
    borderRadius: 10,
    padding: 5,
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