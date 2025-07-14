import { TextInput, Text, View, ScrollView, StyleSheet, TouchableOpacity, FlatList, Platform, Modal } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Material, House } from "../Class/App";
import React from "react";

const house = 
  [ 
    new House("All Houses", "All Houses", "", false),
    new House("ABC", "01", "A Good House", false),
    new House("XYZ", "02", "Great House", false),
  ];
const Home: React.FC = () => {
  const [isDropdownVisible, setDropdownVisible] = React.useState(false);
  const [mobile, setMobile] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [deleteVisible, setDelete] = React.useState(false);
  const [productId, setProductId] = React.useState(-1);
  const [mDropDown, setMDropDown] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [product, setProduct] = React.useState("");
  const [no, setNo] = React.useState(0);
  const [price, setPrice] = React.useState(0.0);
  const [home, setHome] = React.useState(0);
  const toggleDropdown = () => setDropdownVisible(prev => !prev);
  const toggleMaterialDropdown = () => setMDropDown(prev => !prev);

  const handleHouseSelect = (code: string) => {
    let index = house.findIndex(h => h.code === code);
    setHome(index);
    toggleDropdown();
  }
  const handleMaterialSelect = (id: number) => {
    setProductId(material.findIndex(m => m.id === id));
    setProduct(material.find(m => m.id === id)?.product || "");
    toggleMaterialDropdown()
  }
  const [material, setMaterial] = React.useState<Material[]>([
    new Material(house[0], "Abc", 10, 1000)
  ]);


    React.useEffect(() => {
      if (Platform.OS === 'android') {
        setMobile(true);
      }
    }, []);

  const handleClick = (id: number, status: boolean) => {
    setMaterial(prev =>
      prev.map(m =>
        m.id === id
          ? new Material(m.house, m.product, m.no, m.price, status) // status = true
          : m
        )
      );
    };
  
  const addData = () => {
    const data = new Material(house[home], product, no, price);
    setMaterial(prev => [ ...prev, data]);
  }
  const handleDelete = (id: number) => {
    setMaterial(prev => prev.filter(m => m.id !== id));
  };
  return (
    <ScrollView>
      <View style={styles.header}>
        <View style={[styles.card, {backgroundColor: 'rgb(7, 180, 48)'}]}>
          <View>
            <TouchableOpacity onPress={() => toggleMaterialDropdown()} style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.cardText}>{ productId === -1 ? "Material" : material[id].product }</Text>
              <MaterialIcons name="keyboard-arrow-down" style={{fontSize: 20, color: 'rgb(255, 255, 255)'}}/>
            </TouchableOpacity>    
            {mDropDown && (
              <View style={styles.dropDown}>
              <TouchableOpacity onPress={() => handleMaterialSelect(productId)}>
                <Text style={{ fontWeight: "bold"}}>Material</Text>
              </TouchableOpacity>
              <FlatList
                data={material}
                keyExtractor={(item) => item.product}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleMaterialSelect(item.id)}>
                    <Text>{item.product}</Text>
                  </TouchableOpacity>
                )}
              />
              </View>
            )}        
            <Text style={styles.cardText}>{ productId === -1 ? material.length : material.filter(m => m.product === product).length}</Text>
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
                { house[home].name || 'All Houses'}
              </Text>
            </TouchableOpacity>

            {isDropdownVisible && (
              <FlatList
                data={house}
                keyExtractor={(item) => item.name}
                style={styles.dropDown}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleHouseSelect(item.code)}>
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </View>
      <View style={styles.body}>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={{fontSize:24, fontWeight: 'bold', padding: 5}}>Material Purchases</Text>
              <TouchableOpacity style={{backgroundColor: 'rgb(255, 200, 0)', flexDirection: "row", display: 'flex', justifyContent: 'center', alignItems: 'center',
                borderRadius: 15, marginInline: 5, marginBlock: 5,
              }}>
                <MaterialIcons name='edit' style={{color: '#fff', fontSize: 20, padding: 5, borderRadius: 50}}></MaterialIcons>
                <Text style={{color: '#fff', fontWeight: 'bold', paddingRight: 5}}>Enable Editing</Text>
              </TouchableOpacity>
        </View>
        { mobile ? 
        <View style={{gap: 5}}>
          <View style={styles.headerRow}>
            <Text style={[styles.heads, {width: '30%'}]}>Product</Text>
            <Text style={[styles.heads, {width: '15%'}]} numberOfLines={1} ellipsizeMode="tail">No</Text>
            <Text style={[styles.heads, {width: '15%'}]}>Price</Text>
            <Text style={[styles.heads, {width: '30%', textAlign: "left"}]}>Action</Text>
          </View>
          {material.map((materials, index) => ( 

          <TouchableOpacity key={index} style={styles.row} onLongPress={() => {setDelete(true); setId(materials.id);}}>
            <TextInput style={[styles.data, {width: '30%'}]} value={materials.product}/>
            <TextInput style={[styles.data, {width: '20%'}]} value={"" + materials.no}/>
            <TextInput style={[styles.data, {width: '25%'}]} value={"" + materials.price}/>
            {materials.used ?
              <TouchableOpacity style={{width: '20%', padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
              onPress={()=> handleClick(materials.id, false)}>
                <View style={{backgroundColor: 'rgb(6, 149, 13)', flexDirection: 'row', borderRadius: 15, paddingInline: 5, paddingBlock: 5, justifyContent: 'center', alignItems: 'center'}}>
                  <MaterialIcons name='done' style={{fontSize: 20, color: 'rgb(255, 255, 255)',  paddingLeft: 5}}></MaterialIcons>
                  <Text style={{color: 'rgb(255,255,255)', fontWeight: 'bold', paddingRight: 5}}> Remain</Text>
                </View>
              </TouchableOpacity> 
              :      
              <TouchableOpacity style={{width: '25%', padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
              onPress={()=> handleClick(materials.id, true)}>
                <View style={{backgroundColor: 'rgb(237, 188, 29)', flexDirection: 'row', borderRadius: 15, paddingInline: 10, paddingBlock: 5, justifyContent: 'center', alignItems: 'center'}}>
                  <MaterialIcons name='incomplete-circle' style={{fontSize: 20, color: 'rgb(255, 255, 255)', paddingLeft: 2}}></MaterialIcons>
                  <Text style={{color: 'rgb(255,255,255)', fontWeight: 'bold'}}> Finish</Text>
                </View>
              </TouchableOpacity>
            }
          </TouchableOpacity>
          ))}
        </View>

          :
        
        <View style={{gap: 5}}>
          <View style={styles.headerRow}>
            <Text style={[styles.heads, {width: '30%'}]}>Product</Text>
            <Text style={[styles.heads, {width: '10%'}]} numberOfLines={1} ellipsizeMode="tail">Items</Text>
            <Text style={[styles.heads, {width: '20%'}]}>Total Price</Text>
            <Text style={[styles.heads, {width: '10%'}]}>Price</Text>
            <Text style={[styles.heads, {width: '30%', textAlign: "center"}]}>Action</Text>
          </View>
          {material.map((materials, index) => ( 

          <TouchableOpacity key={index} style={styles.row} onLongPress={() => {setDelete(true); setId(materials.id);}}>
            <TextInput style={[styles.data, {width: '15%'}]} value={materials.product} 
                onChangeText={(text) => {
                const updated = [...material];
                updated[index].product = text; // only updates product
                setMaterial(updated);
            }}/>
            <TextInput style={[styles.data, {width: '15%'}]} value={materials.house.name} />
            <TextInput style={[styles.data, {width: '10%'}]} value={"" + materials.no} keyboardType="numeric"
                onChangeText={(text) => {
                  const updated = [...material];
                  updated[index].no = parseInt(text) || 0;
                  setMaterial(updated);
            }}/>
            <TextInput style={[styles.data, {width: '20%'}]} value={"" + materials.price*materials.no}/>
            <TextInput style={[styles.data, {width: '10%'}]} value={"" + materials.price}
                onChangeText={(text) => {
                  const updated = [...material];
                  updated[index].price = parseInt(text) || 0;
                  setMaterial(updated);
            }}/>
            {materials.used ?
              <TouchableOpacity style={{width: '15%', padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
              onPress={()=> handleClick(materials.id, false)}>
                <View style={{ width: '100%' , backgroundColor: 'rgb(6, 149, 13)', flexDirection: 'row', borderRadius: 15, paddingInline: 5, paddingBlock: 5, justifyContent: 'center', alignItems: 'center'}}>
                  <MaterialIcons name='done' style={{fontSize: 20, color: 'rgb(255, 255, 255)',  paddingLeft: 5}}></MaterialIcons>
                  <Text style={{color: 'rgb(255,255,255)', fontWeight: 'bold', paddingRight: 5}}> Remain</Text>
                </View>
              </TouchableOpacity> 
              :      
              <TouchableOpacity style={{width: '15%', padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
              onPress={()=> handleClick(materials.id, true)}>
                <View style={{ width: '100%' , backgroundColor: 'rgb(237, 188, 29)', flexDirection: 'row', borderRadius: 15, paddingInline: 10, paddingBlock: 5, justifyContent: 'center', alignItems: 'center'}}>
                  <MaterialIcons name='incomplete-circle' style={{fontSize: 20, color: 'rgb(255, 255, 255)', paddingLeft: 2}}></MaterialIcons>
                  <Text style={{color: 'rgb(255,255,255)', fontWeight: 'bold'}}> Finish</Text>
                </View>
              </TouchableOpacity>
            }
              <TouchableOpacity style={{width: '15%', backgroundColor: 'rgb(255, 0, 0)', flexDirection: "row", display: 'flex', justifyContent: 'center', alignItems: 'center',
                borderRadius: 15, marginInline: 5, marginBlock: 5,}}  onPress={() => handleDelete(materials.id)}>
                <MaterialIcons name='delete' style={{backgroundColor: 'rgb(255, 0, 0)', color: '#fff', fontSize: 20, padding: 5, borderRadius: 50}}></MaterialIcons>
                <Text style={{color: '#fff', fontWeight: 'bold', paddingRight: 5}}>Delete</Text>
              </TouchableOpacity>
          </TouchableOpacity>
          ))}
        </View>
      }
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
              }}
            />
            <View>
            <Text style={{ fontSize: 18, display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: 5 }}>
              <MaterialIcons name='home' style={{fontSize: 32}}></MaterialIcons>  House</Text>
              <TouchableOpacity style={{backgroundColor: 'rgb(255, 255, 255)', borderBottomWidth: 1, borderColor: '#000', paddingInline: 15, paddingBlock: 5, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} 
                              onPress={toggleDropdown}>
              <Text style={{color: 'rgba(0, 0, 0, 1)'}}>
                { home !== -1 ? house[home].code : 'All Houses'}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" style={{fontSize: 20}}/>
            </TouchableOpacity>

            {isDropdownVisible && (
              <FlatList
                style={styles.HouseList}
                data={house}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleHouseSelect(item.code)}>
                    <Text>{item.code}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            </View>
            <View>
              <TouchableOpacity style={{backgroundColor: 'rgb(26, 153, 12)', borderRadius: 15, paddingInline: 10, paddingBlock: 5}}
              onPress={() => addData()}>
                <Text style={{textAlign: 'center', color: 'rgb(255, 255, 255)', fontWeight: 900}}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity onPress={() =>{ setVisible(false);}} style={{borderRadius: 50, backgroundColor: 'rgba(48, 47, 47, 0.51)', justifyContent:'center', alignItems: 'center'}}>
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
                                    onPress={() => {
                                      setDelete(false); 
                                      setVisible(true);
                                      setProduct(material.find(m => m.id === id)?.product || "");
                                      setNo(material.find(m => m.id === id)?.no || 0);
                                      setPrice(material.find(m => m.id === id)?.price || 0);
                                      setHome(house.findIndex(h => h.code === material.find(m => m.id === id)?.house.code));
                                    }
                                  }>
                    <MaterialIcons name='remove-red-eye' style={{ color: 'white', fontSize: 24 }} />
                    <Text style={{color: 'white', fontWeight: "bold"}}>View</Text>
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
    paddingInline: 15,
  },
  card: {
    flex: 1,
    minWidth: 300,
    padding: 10,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    width: 120,
    height: 180,
    position: 'absolute',
    top: -20,
    borderRadius: 10,
    zIndex: 100,
  },
  body: {
    backgroundColor: 'rgb(255, 255, 255)',
    marginInline: 15,
    borderRadius: 15,
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
    flexDirection: 'row',
    backgroundColor: 'rgb(229, 248, 212)',
    borderRadius: 10,
  },
  data: {
    borderWidth: 0,
    outline: 'none',
    fontSize: 16,
    fontWeight: 'bold', 
    paddingInline: 10
  }, 
  HouseList: {
    position: 'absolute',
    backgroundColor: 'rgba(182, 255, 175, 1)',
    padding: 10,
    borderRadius: 10,
    width: 150, 
    top: -50,
    height: 120,
  }
});