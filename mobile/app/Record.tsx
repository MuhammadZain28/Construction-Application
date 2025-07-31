import React from "react";
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, TextInput, FlatList, Platform, Modal } from "react-native";
import { Ionicons, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router";
import { Data, Records } from "./Class/App";
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from "expo-linear-gradient";

const Record: React.FC = () => {
  const { Recordid, name, Total, wallet, house } = useLocalSearchParams();
  const [searchData, setSearchData] = React.useState("");
  const [record, setRecord] = React.useState<Data[]>([]);
  const [cash, setCash] = React.useState(0);
  const [date, setDate] = React.useState(new Date());
  const [reason, setReason] = React.useState("Other");
  const [formType, setFormType] = React.useState("");
  const [showReasons, setShowReasons] = React.useState(false);
  const [showDate, setShowDate] = React.useState(false);
  const [id, setId] = React.useState("");
  const [updateVisible, setUpdateVisible] = React.useState(false);
  const [mobile, setMobile] = React.useState(true);
  const [RecordId, setRecordId] = React.useState<string>("");
  const [prevCash, setPrevCash] = React.useState(0);
  const [TotalAmount, setTotalAmount] = React.useState(0);
  const [prevType, setPrevType] = React.useState<'In' | 'Out'>('In');
const transactionReasons = [
  "Other",
  // Income-Related
  "Sale",
  "Payment Received",
  "Refund Received",
  "Bonus",
  "Interest Income",
  "Investment Return",

  // Expense-Related
  "Purchase",
  "Bill Payment",
  "Rent",
  "Utilities",
  "Salary Payment",
  "Refund Issued",
  "Maintenance",
  "Transportation",
  "Marketing",
  "Subscription",

  // Transfer/Adjustment
  "Fund Transfer",
  "Cash Deposit",
  "Cash Withdrawal",
  "Internal Adjustment",
  "Currency Exchange",

  // Inventory/Material Usage
  "Stock Purchase",
  "Stock Sale",
  "Damaged Goods",
  "Returned Items",
  "Sample Distribution",

  // Custom/Other
  "Miscellaneous",
  "Donation",
  "Correction",
  "Penalty",
  "Commission",
  "Tax Payment"
];
  React.useEffect(() => {
    const fetchRecords = async () => {
      if (typeof Recordid === "string") {
        setRecordId(Recordid);
      } else if (Array.isArray(Recordid)) {
        setRecordId(Recordid[0]);
      }
      const fetchedRecords = await Records.getRecordsByID(RecordId);
      setRecord(fetchedRecords);
    };
    fetchRecords();
  }, [Recordid, RecordId]);

  React.useEffect(() => {
    const check = () => {
      if (Platform.OS === 'web') {
        setMobile(false);
      }
    }

    check();
  }, []);

  React.useEffect(() => {
    setTotalAmount(parseInt(Total.toString()));
  }, [Total]);

  const onChange = (event: any, selectedDate: Date | undefined) => {
    setShowDate(false);
    if (selectedDate) {
      setDate(selectedDate);
    } else {
      setDate(new Date());
    }
  };
  const saveRecord = async (type: 'In' | 'Out') => {
    if (cash <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (reason.length === 0) {
      alert("Please enter a reason");
      return;
    }
    const amount = type === 'In' ? TotalAmount + cash : TotalAmount - cash;
    setTotalAmount(amount);
    const id = await Data.save(RecordId, cash, type, date.toISOString().substring(0, 10), amount, reason);
    setRecord(m => [...m, { id: id, amount: cash, type, date: date.toISOString().substring(0, 10), reason }]);
    setUpdateVisible(false);
    setCash(0);
    setDate(new Date());
    setReason("Other");
    setId("");
    setFormType("");
  };
  const updateRecord = async (type: 'In' | 'Out') => {
    if (cash <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (reason.length === 0) {
      alert("Please enter a reason");
      return;
    }
    const RemainingAmount = TotalAmount - (prevType === 'In' ? prevCash : -prevCash);
    alert(`Remaining Amount: ${RemainingAmount}, Previous Amount: ${prevCash}, Cash: ${cash}`);
    const amount = type === 'In' ? RemainingAmount + cash : RemainingAmount - cash;
    setTotalAmount(amount);
    alert(`Remaining Amount: ${amount}, Previous Amount: ${prevCash}, Cash: ${cash}`);
    await Data.updateData(RecordId, id, cash, type, date.toISOString().substring(0, 10), amount, reason);
    setRecord(prev => prev.map(item => item.id === id ? new Data(item.id, cash, type, date.toISOString().substring(0, 10), reason) : item));
    setUpdateVisible(false);
    setCash(0);
    setDate(new Date());
    setReason("Other");
    setId("");
    setFormType("");
  };
  const deleteRecord = async () => {
    if (id.length === 0) {
      alert("Please select a record to delete");
      return;
    }
    const amount = TotalAmount - (prevType === 'In' ? prevCash : -prevCash);
    alert(`Remaining Amount: ${amount}, Previous Amount: ${prevCash}, Cash: ${cash}`);
    setTotalAmount(amount);
    await Data.deleteData(RecordId, id, amount);
    setRecord(prev => prev.filter(item => item.id !== id));
    setUpdateVisible(false);
    setCash(0);
    setDate(new Date());
    setReason("Other");
    setId("");
    setFormType("");
  };
  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 10, padding: 10 }}>
        <LinearGradient
          colors={['rgba(249, 196, 2, 1)', 'rgba(245, 213, 84, 1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ minHeight: 200, maxWidth: 450, width: '100%', borderRadius: 20, margin: 10, padding: 20, shadowColor: '#000', justifyContent: 'space-between', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'rgba(255, 255, 255, 1)' }}> <FontAwesome6 name="user-circle" size={24} color={'rgba(255, 255, 255, 1)'}/>  {name}</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'rgba(255, 255, 255, 1)', marginTop: 10 }}>    Rs.  {TotalAmount}</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 1)', width: 100, height: 100, borderRadius: 50, padding: 10 }}>
              <FontAwesome6 name="user" size={64} color={'rgba(245, 213, 84, 1)'}/>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="wallet" size={20} color={'white'} />
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'rgba(255, 255, 255, 1)' }}>{wallet}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="home" size={20} color={'white'}/>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'rgba(255, 255, 255, 1)' }}>{house}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.icon}>Records</Text>
          <TouchableOpacity style={[styles.row, { gap: 10, paddingBlock: 10, paddingInline: 20, backgroundColor: 'rgba(0, 35, 123, 1)', borderRadius: 50 }]} onPress={() => { setFormType('Record'); setUpdateVisible(true); }}>
            <Ionicons name='book' color={'rgb(255,255,255)'} size={20}></Ionicons>
            <Text style={{fontSize: 18, fontWeight: '900', color: 'rgb(255,255,255)'}}>Record</Text>
          </TouchableOpacity>
        </View>
            
        <View style={styles.searchBar}>
          <TextInput placeholder='Search....' style={styles.searchInput} value={searchData} onChangeText={setSearchData}/>
          { searchData.length > 0 &&
            <TouchableOpacity onPress={() => setSearchData("")} style={{ position: 'absolute', right: 10}}><Ionicons name='close' size={18} color={'rgba(255, 174, 0, 1)'}/></TouchableOpacity>
          }
          { searchData.length > 0 &&
            <FlatList 
              data= {record.filter(item => item.date.includes(searchData.toLowerCase()))}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  setCash(item.amount);
                  setDate(new Date(item.date));
                  setReason(item.reason || 'Other');
                  setFormType('Record');
                }}>
                  <Text style={{ padding: 10, fontSize: 16 }}>Rs. {item.amount}       ({item.date})</Text>
                </TouchableOpacity>
              )}
              style={{ position: 'absolute', width: 350, backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: 10, marginTop: 100, zIndex: 100, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}
            />
          }
        </View>
        <View style={{ gap: 10, marginTop: 10 }}>
          { record.map((item, index) => (
            item.type === 'In' ?
          <TouchableOpacity key={index} style={[styles.row, { backgroundColor: 'rgba(4, 159, 9, 0.1)', padding: 10, borderRadius: 10 }]} 
          onLongPress={() => {setId(item.id); setFormType('Delete'); setPrevCash(item.amount); }}
          onPress={() => {
                  setId(item.id);
                  setCash(item.amount);
                  setPrevCash(item.amount);
                  setPrevType(item.type);
                  setDate(new Date(item.date));
                  setReason(item.reason || 'Other');
                  setFormType('Record');
                }}>
            <View style={[styles.row, { gap: 10 }]}>
              <FontAwesome6 name='user-circle' size={30} color={'rgba(4, 159, 9, 1)'} />
              <Text style={{fontSize: 16, color: 'rgba(4, 159, 9, 1)', fontWeight: 700}}>Rs.  {item.amount}</Text>
            </View>
            <Text style={{color: 'rgba(4, 159, 9, 1)', fontSize: 16, fontWeight: 700}}>{item.date}</Text>
          </TouchableOpacity>
          :
          <TouchableOpacity key={index} style={[styles.row, { backgroundColor: 'rgba(159, 4, 4, 0.1)', padding: 10, borderRadius: 10 }]} 
          onLongPress={() => {setId(item.id); setFormType('Delete'); setPrevCash(item.amount); setPrevType(item.type); }} 
          onPress={() => {
                  setId(item.id);
                  setCash(item.amount);
                  setPrevCash(item.amount);
                  setPrevType(item.type);
                  setDate(new Date(item.date));
                  setReason(item.reason || 'Other');
                  setFormType('Record');
                }}>
            <View style={[styles.row, { gap: 10 }]}>
              <FontAwesome6 name='user-circle' size={30} color={'rgba(211, 0, 0, 1)'} />
              <Text style={{fontSize: 16, color: 'rgba(211, 0, 0, 1)', fontWeight: 700}}>Rs.  {item.amount}</Text>
            </View>
            <Text style={{color: 'rgba(211, 0, 0, 1)', fontSize: 16, fontWeight: 700}}>{item.date}</Text>
          </TouchableOpacity>
          ))}
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={formType === ''? false : true}
        onRequestClose={() => {
          setFormType('');
        }}>
        {{ Record:
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', gap: 30}}>
  
          <View style={styles.form}>
            <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 24, marginBottom: 30, }}>Records</Text>
            <Text style={[{color: 'rgb(0,0,0)', fontSize: 18, fontWeight: '700'}]}>Cash</Text>
            <TextInput style={[styles.input, {outline: 'none'}]} value={cash.toString()} onChangeText={(e) => {setCash(parseInt(e))}} keyboardType='numeric'/>
            <Text style={[{color: 'rgb(0,0,0)', fontSize: 18, fontWeight: '700'}]}>Reason</Text>
            <View style={[styles.input, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10}]}>
              <TextInput style={[{color: 'rgb(0,0,0)', width: '100%', outline: 'none'}]} value={reason} onChangeText={(e) => {setReason(e); setShowReasons(true)}}/>
              <TouchableOpacity>
                <Ionicons name='chevron-down' size={20} color={'rgb(0,0,0)'}/>
              </TouchableOpacity>
              { (reason.length > 0 && showReasons) &&
                <FlatList
                      data={transactionReasons.filter(t => t.toLowerCase().includes(reason.toLowerCase()))}
                      keyExtractor={(item) => item}
                      style={{ position: 'absolute', width: '100%', backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: 10, top: 50, left: 0, zIndex: 100, shadowColor: '#000', height: 250,shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}
                      scrollEnabled={true}
                      renderScrollComponent={(props) => <ScrollView {...props} />}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => {
                          setReason(item);
                          setShowReasons(false);
                        }} style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15, borderBottomColor: '#ddd', borderBottomWidth: 1}}>
                          { item === reason ?
                          <MaterialCommunityIcons name="circle-slice-8" style={{fontSize: 20, color: 'rgb(7, 180, 48)', paddingRight: 10}}/>
                          :
                          <MaterialCommunityIcons name="circle-outline" style={{fontSize: 20, color: 'rgb(7, 180, 48)', paddingRight: 10}}/>
                          }
                          <Text style={{fontSize: 18}}>{item}</Text>
                        </TouchableOpacity>
                      )}
                  />
              }
            </View>
            <Text style={[{color: 'rgb(0,0,0)', fontSize: 18, fontWeight: '700'}]}>Date</Text>
            { !mobile ?

              <input type="date" value={date instanceof Date && !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : ''}
              onChange={(e) => setDate(new Date(e.target.value))} style={{ borderBottomColor: '#000', height: 40, borderBottomWidth: 1, borderInlineWidth: 0, borderTopWidth: 0, marginBottom: 20, fontFamily: 'Arial'}}/>
              :
              <View>
              <TouchableOpacity style={{backgroundColor: 'rgb(255, 255, 255)', borderBottomWidth: 1, borderColor: '#000', paddingInline: 15, paddingBlock: 5, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} 
              onPress={() => setShowDate(true)}>
              <Text style={{color: 'rgba(0, 0, 0, 1)'}}>
                {date.toLocaleDateString()}
              </Text>
              <Ionicons name="chevron-down" style={{fontSize: 20}}/>
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
            { updateVisible ?
            <View style={[styles.row, { justifyContent: 'space-around', marginTop: 20 }]}>
              <TouchableOpacity onPress={() => saveRecord('Out')} style={{ width: '40%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 0, 0, 1)', borderRadius: 20, paddingInline: 10, paddingBlock: 5,}}>
                <Text style={styles.text}>Out</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => saveRecord('In')} style={{ width: '40%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(26, 173, 0, 1)', borderRadius: 20, paddingInline: 10, paddingBlock: 5,}}>
                <Text style={styles.text}>In</Text>
              </TouchableOpacity>
            </View>
            :
            <View style={[styles.row, { justifyContent: 'space-around', marginTop: 20 }]}>
              <TouchableOpacity onPress={() => updateRecord('Out')} style={{ width: '40%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 0, 0, 1)', borderRadius: 20, paddingInline: 10, paddingBlock: 5,}}>
                <Text style={styles.text}>Out</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => updateRecord('In')} style={{ width: '40%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(26, 173, 0, 1)', borderRadius: 20, paddingInline: 10, paddingBlock: 5,}}>
                <Text style={styles.text}>In</Text>
              </TouchableOpacity>
            </View>
            }
          </View>
          <TouchableOpacity onPress={() => setFormType('')} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 50,}}>
            <MaterialCommunityIcons name="close" size={30} color={'rgba(255, 255, 255, 1)'} style={{ padding: 20, }} />
          </TouchableOpacity>
        </View>,
        Delete:
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <View style={{width: '100%', backgroundColor: 'rgba(255, 255, 255, 1)', gap: 20, bottom: 0, position: 'absolute', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}>
            <Text style={{fontSize: 14, fontWeight: 'bold'}}>DELETE RECORD</Text>
            <View style={{ flexDirection: 'row', marginTop: 20, maxWidth: 500, alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 20 }}>
              <TouchableOpacity onPress={() => setFormType('')} style={{ backgroundColor: 'rgba(0, 42, 255, 1)', gap: 5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', minWidth: 100, paddingBlock: 10, paddingInline: 25, borderRadius: 50}}>
                <MaterialCommunityIcons name="delete" size={24} color={'white'} />
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancel</Text>

              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => deleteRecord()} style={{ backgroundColor: 'rgba(255, 0, 0, 1)', gap: 5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', minWidth: 100, paddingBlock: 10, paddingInline: 25, borderRadius: 50 }}>
                <MaterialCommunityIcons name="delete" size={24} color={'white'} />
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete</Text>

              </TouchableOpacity>
            </View>
          </View>
        </View>}[formType] }
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dbdbdb',
  },
  body: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,  
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(0, 35, 123, 1)',
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
    width: '90%',
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
  form: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 10,
    fontSize: 16,
    color: 'rgb(0,0,0)',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Record;