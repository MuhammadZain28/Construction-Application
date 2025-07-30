import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Modal, TextInput, FlatList, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useDataContext } from './DataContext';
import { House, Wallets, Transactions, Records } from '../Class/App';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';

export default function Wallet() {
  const { houses, wallet, transactions, record, materials, paints, setIsRecordUpdated, setIsTransactionUpdated, setIsWalletUpdated } = useDataContext();
  const [search, setSearch] = React.useState('');
  const [searchData, setSearchData] = React.useState('');
  const [house, setHouse] = React.useState<House[]>([]);
  const [home, setHome] = React.useState<string>('');
  const [formType, setFormType] = React.useState('');
  const [showDate, setShowDate] = React.useState(false);
  const [date, setDate] = React.useState<Date>(new Date());
  const [mobile, setMobile] = React.useState<boolean>(true);
  const [wallets, setWallets] = React.useState<Wallets[]>([]);  
  const [cash, setCash] = React.useState<number>(0);
  const [name, setName] = React.useState<string>('');
  const [id, setId] = React.useState<string>('');
  const [Walletid, setWalletid] = React.useState<string>('main');
  const [reason, setReason] = React.useState<string>('Other');
  const [index, setIndex] = React.useState<number>(0);
  const [showReasons, setShowReasons] = React.useState<boolean>(false);
  const [transaction, setTransaction] = React.useState<Transactions[]>([]);
  const [deleteType, setDeleteType] = React.useState<string>('');
  const [records, setRecords] = React.useState<Records[]>([]);
  const [updateVisible, setUpdateVisible] = React.useState<boolean>(false);
  const [dropDownType, setDropDownType] = React.useState<string>('');
  const [sum, setSum] = React.useState<number>(0);
  const [outSum, setOutSum] = React.useState<number>(0);
  const [lastInTransaction, setLastInTransaction] = React.useState<number>(0);
  const [lastOutTransaction, setLastOutTransaction] = React.useState<number>(0);
  const router = useRouter();
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
    const MonthlySum = async () => {
      const month = new Date().toISOString().slice(0, 7);
      let sum = 0;
      setSum(0);
      setOutSum(0);
      sum = await Wallets.getMonthlySum(month, Walletid);
      setSum(prev => prev + sum);
      sum = await Transactions.getMonthlySum(month, 'In', Walletid);
      setSum(prev => prev + sum);
      sum = await Transactions.getMonthlySum(month, 'Out', Walletid);
      setOutSum(prev => prev + sum);
    }
    MonthlySum();
  }, [Walletid, transactions, records]);

  React.useEffect(() => {
    const lastTransaction = async () => {
      const amount = transactions.filter(item => item.wallet === Walletid && item.type === 'In').sort((a, b) => a.date.localeCompare(b.date));
      setLastInTransaction(amount[amount.length - 1]?.amount || 0);
      const outAmount = transactions.filter(item => item.wallet === Walletid && item.type === 'Out').sort((a, b) => a.date.localeCompare(b.date));
      setLastOutTransaction(outAmount[outAmount.length - 1]?.amount || 0);
    }
    lastTransaction();
  }, [Walletid, transactions]);

  React.useEffect(() => {
    const fetch = () => {
      setHouse(houses);
      setWallets(wallet);
      setTransaction(transactions);
      setRecords(record);
    }

    fetch();
  }, [houses, wallet, transactions, record]);

  React.useEffect(() => {
    setIndex(wallets.findIndex(item => item.id === Walletid));
  }, [wallets, Walletid]);

  const onChange = (event: any, selectedDate: Date | undefined) => {
    setShowDate(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  React.useEffect(() => {
    const check = () => {
      if (Platform.OS === 'web') {
        setMobile(false);
      }
    }

    check();
  }, []);

  const handleHouseSelect = (code: string) => {
    setHome(code);
    setDropDownType('');
  };

  const add = async () => {
    if (home === '') {
      Alert.alert('Please select a house');
      return;
    }
    try {
      Wallets.save(name, home, cash, date.toISOString().substring(0, 10));
      setIsWalletUpdated(true);
      setFormType('');
    } 
    catch (error) {
      console.error('Error creating wallet:', error);
    }
  }
  const updateCash = async () => {
    try {
      const walletItem = wallets.find(item => item.id === Walletid);
      if (!walletItem) {
        Alert.alert('Wallet not found');
        return;
      }
      const amount = walletItem.amount + cash;
      Wallets.UpdateAmount(Walletid, amount, date.toISOString().substring(0, 10), cash);
      setIsWalletUpdated(true);
      setFormType('');
    }
    catch (error) {
      console.error('Error updating wallet:', error);
    }
  }

  const saveTransaction = async (type: 'In' | 'Out') => {
    if (name === '' || cash <= 0) {
      Alert.alert('Please fill all fields');
      return;
    }
    try {
      await Transactions.save(Walletid, cash, type, date.toISOString().substring(0, 10), reason, name);
      setIsTransactionUpdated(true);
      setFormType('');
      setUpdateVisible(false);
    } 
    catch (error) {
      console.error('Error saving transaction:', error);
    }
  }

  const saveRecord = async (type: 'In' | 'Out') => {
    if (name === '' || cash <= 0) {
      Alert.alert('Please fill all fields');
      return;
    }
    try {
      await Records.save(name, Walletid, cash, type, date.toISOString().substring(0, 10), reason);
      setIsRecordUpdated(true);
      setFormType('');
      setUpdateVisible(false);
    } 
    catch (error) {
      console.error('Error saving record:', error);
    }
  }

  const remove = async (type: string) => {
    try {
      if (type === 'transaction') {
        Transactions.deleteTransaction(id);
        setIsTransactionUpdated(true);
        setDropDownType('');
      }
      else if (type === 'wallet') {
        Wallets.deleteWallet(Walletid);
        setWalletid("main");
        setIsWalletUpdated(true);
        setDropDownType('');
      }
      else if (type === 'record') {
        Records.deleteRecord(id);
        setIsRecordUpdated(true);
        setDropDownType('');
      }
      else {
        Alert.alert('Invalid type');
        return;
      }
    } 
    catch (error) {
      console.error('Error removing transaction:', error);
    }
  }
  const updateTransaction = async (type: 'In' | 'Out') => {
    if (name === '' || cash <= 0) {
      Alert.alert('Please fill all fields');
      return;
    }
    try {
      Transactions.update(id, Walletid, cash, type, date.toISOString().substring(0, 10), reason, name);
      setIsTransactionUpdated(true);
      setFormType('');
    }
    catch (error) {
      console.error('Error updating transaction:', error);
    }
  }
  const updateRecord = async (type: 'In' | 'Out') => {
    if (name === '' || cash <= 0) {
      Alert.alert('Please fill all fields');
      return;
    }
    try {

      Records.UpdateRecord(id, name, Walletid, cash, type, date.toISOString().substring(0, 10), reason);
      setIsRecordUpdated(true);
      setFormType('');
    }
    catch (error) {
      console.error('Error updating record:', error);
    }
  }

  return (
    <ScrollView style={{ backgroundColor: '#dbdbdbff', padding: 10 }}>
        <View style={styles.main}>
          <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 10, width: '100%' }]}>
              <LinearGradient
                colors={['#192f5d', '#3b5998', '#4c669f'  ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.5, 1]}
                style ={[{ padding: 20, borderRadius: 10, margin: 0,}, styles.card]} onTouchEnd={() => {setDropDownType('Delete'); setDeleteType("wallet")}}>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }} onPress={() => setDropDownType('Wallet')}>
                    <Ionicons name="wallet" size={28} color="#fff" />
                    <Text style={styles.head}>{ wallets[index]?.name || 'Wallet'}</Text>
                  </TouchableOpacity>
                  <View>
                    <Text style={styles.text}>Rs. {wallets[index]?.amount - materials.filter(item => item.house === wallets[index]?.house).reduce((sum, item) => sum + item.price*item.no, 0) - paints.filter(item => item.house === wallets[index]?.house).reduce((sum, item) => sum + item.price*item.no, 0) + transaction.filter(item => item.wallet === wallets[index]?.id).reduce((sum, item) => sum + item.amount, 0) + records.filter(item => item.wallet === wallets[index]?.id).reduce((sum, item) => sum + item.amount, 0)}</Text>
                  </View>
                  <View style={styles.container}>
                    <View style={[styles.circle1]} />
                    <View style={[styles.circle2]} />
                  </View> 
                  <TouchableOpacity style={{ position: 'absolute', top: 90, right: 23, backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingInline: 12, paddingBlock: 5, borderRadius: 50, flexDirection: 'row', alignItems: 'center', gap: 5 }} onPress={() => setFormType('Cash')}>
                    <Ionicons name="add-circle" size={20} color="#fff" />
                    <Text style={{color: 'rgb(255,255,255)', fontWeight: '700'}}>Cash In</Text>
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                    <View style={{ flex: 1, alignItems: 'center', gap: 20 }}>
                      <Text style={{textAlign: 'center', color: 'rgb(255, 255, 255)', fontWeight: '700'}}>Monthly In</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Text style={{color: 'rgb(255, 255, 255)'}}>Rs. {sum}</Text>
                        <View style={{ backgroundColor: 'rgba(10, 255, 10, 0.52)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingInline: 5, borderRadius: 10 }}>
                          <Ionicons name='arrow-up' size={12} color={'rgb(255, 255,255)'}/>
                          <Text style={{color: 'rgb(255,255,255)', fontSize: 12}}> {lastInTransaction}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', gap: 20 }}>
                      <Text style={{textAlign: 'center', color: 'rgb(255, 255, 255)', fontWeight: '700'}}>Monthly Out</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Text style={{color: 'rgb(255, 255, 255)'}}>Rs. {outSum}</Text>
                        <View style={{ backgroundColor: 'rgba(255, 0, 0, 0.6)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingInline: 5, borderRadius: 10 }}>
                          <Ionicons name='arrow-down' size={12} color={'rgb(255, 255,255)'}/>
                          <Text style={{color: 'rgb(255,255,255)', fontSize: 12}}> {lastOutTransaction}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
              </LinearGradient>
            <TouchableOpacity style={[{ width: '100%', justifyContent: 'center', alignItems: 'center' }]} onPress={() => setFormType('Card')}>
              <Ionicons name='add' size={36} style={{padding: 20, backgroundColor: 'rgba(255, 255, 255, 0.75)', borderRadius: 50, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2}}/>
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            <View style={styles.row}>
              <Text style={styles.icon}>Transactions</Text>
              <TouchableOpacity style={[styles.row, { gap: 10, paddingBlock: 10, backgroundColor: 'rgba(0, 35, 123, 1)', borderRadius: 50 }]} onPress={() => {setFormType('Transaction'); setUpdateVisible(true);}}>
                <Ionicons name='receipt' color={'rgb(255,255,255)'} size={20}></Ionicons>
                <Text style={{fontSize: 18, fontWeight: '900', color: 'rgb(255,255,255)'}}>Transaction</Text>
              </TouchableOpacity>
            </View>
            
        <View style={styles.searchBar}>
          <TextInput placeholder='Search....' style={styles.searchInput} value={search} onChangeText={setSearch}/>
          { search.length > 0 &&
            <TouchableOpacity onPress={() => setSearch("")} style={{ position: 'absolute', right: 10}}><Ionicons name='close' size={18} color={'rgba(255, 174, 0, 1)'}/></TouchableOpacity>
          }
          { search.length > 0 &&
            <FlatList 
              data={transaction.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))} 
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {setName(item.name); setWalletid(item.wallet); setCash(item.amount); setDate(new Date(item.date)); setReason(item.reason || 'Other'); setFormType('Transaction'); setId(item.id);}}>
                  <Text style={{ padding: 10, fontSize: 16 }}>{item.name}</Text>
                </TouchableOpacity>
              )}
              style={{ position: 'absolute', width: 350, backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: 10, marginTop: 170, zIndex: 100, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}
            />
          }
        </View>
            <View style={{ gap: 10, marginTop: 10 }}>
              { transaction.filter(t => t.wallet === Walletid).map((item, index) => (
                 item.type === 'In' ?
                <TouchableOpacity key={index} style={[styles.row, { backgroundColor: 'rgba(4, 159, 9, 0.1)', padding: 10, borderRadius: 10 }]} 
                onLongPress={() => {setDropDownType('Delete'); setId(item.id); setDeleteType('transaction');}}
                onPress={() => {setName(item.name); setWalletid(item.wallet); setCash(item.amount); setDate(new Date(item.date)); setReason(item.reason || 'Other'); setFormType('Transaction'); setId(item.id);}}>
                  <Text style={{fontSize: 16, color: 'rgba(4, 159, 9, 1)', fontWeight: 700}}>{item.name}</Text>
                  <View style={[styles.row, { gap: 10 }]}>
                    <Text style={{color: 'rgba(4, 159, 9, 1)', fontSize: 16, fontWeight: 700}}>Rs. {item.amount}</Text>
                    <Ionicons name='arrow-up' size={20} color={'rgba(4, 159, 9, 1)'} />
                  </View>
                </TouchableOpacity>
                :
                <TouchableOpacity key={index} style={[styles.row, { backgroundColor: 'rgba(159, 4, 4, 0.1)', padding: 10, borderRadius: 10 }]} onLongPress={() => {setDropDownType('Delete'); setId(item.id); setDeleteType('transaction');}}
                onPress={() => {setName(item.name); setWalletid(item.wallet); setCash(item.amount); setDate(new Date(item.date)); setReason(item.reason || 'Other'); setFormType('Transaction'); setId(item.id);}}>
                  <Text style={{fontSize: 16, color: 'rgba(211, 0, 0, 1)', fontWeight: 700}}>{item.name}</Text>
                  <View style={[styles.row, { gap: 10 }]}>
                    <Text style={{color: 'rgba(211, 0, 0, 1)', fontSize: 16, fontWeight: 700}}>Rs. {-item.amount}</Text>
                    <Ionicons name='arrow-down' size={20} color={'rgba(211, 0, 0, 1)'} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
        </View>
          
          <View style={styles.body}>
            <View style={styles.row}>
              <Text style={styles.icon}>Records</Text>
              <TouchableOpacity style={[styles.row, { gap: 10, paddingBlock: 10, backgroundColor: 'rgba(0, 35, 123, 1)', borderRadius: 50 }]} onPress={() => { setFormType('Record'); setUpdateVisible(true);}}>
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
                  data= {records.filter(item => item.name.toLowerCase().includes(searchData.toLowerCase()))}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {
                      setName(item.name);
                      setCash(item.amount);
                      setDate(new Date(item.date));
                      setReason(item.reason || 'Other');
                      setFormType('Record');
                    }}>
                      <Text style={{ padding: 10, fontSize: 16 }}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  style={{ position: 'absolute', width: 350, backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: 10, marginTop: 170, zIndex: 100, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}
                />
              }
            </View>
            <View style={{ gap: 10, marginTop: 10 }}>
              { records.filter(r => r.wallet === Walletid).map((item, index) => (
                item.amount >= 0 ?
              <TouchableOpacity key={index} style={[styles.row, { backgroundColor: 'rgba(4, 159, 9, 0.1)', padding: 10, marginInline: 10, borderRadius: 10 }]} 
              onLongPress={() => {setDropDownType('Delete'); setId(item.id); setDeleteType('record');}}
              onPress={() => {
                      router.push({pathname: '/Record', params: { Recordid: item.id, name: item.name, Total: item.amount, wallet: wallet.find(w => w.id === item.wallet)?.name, house: wallet.find(w => w.id === item.wallet)?.house }});
                    }}>
                <View style={[styles.row, { gap: 10 }]}>
                  <FontAwesome6 name='user-circle' size={30} color={'rgba(4, 159, 9, 1)'} />
                  <Text style={{fontSize: 16, color: 'rgba(4, 159, 9, 1)', fontWeight: 700}}>{item.name}</Text>
                </View>
                <Text style={{color: 'rgba(4, 159, 9, 1)', fontSize: 16, fontWeight: 700}}>Rs. {item.amount}</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity key={index} style={[styles.row, { backgroundColor: 'rgba(159, 4, 4, 0.1)', padding: 10, marginInline: 10, borderRadius: 10 }]} 
              onLongPress={() => {setDropDownType('Delete'); setId(item.id); setDeleteType('record');}} 
              onPress={() => {
                      router.push({ pathname: '/Record', params: { Recordid: item.id, name: item.name, Total: item.amount, wallet: wallet.find(w => w.id === item.wallet)?.name, house: wallet.find(w => w.id === item.wallet)?.house }});
                    }}>
                <View style={[styles.row, { gap: 10 }]}>
                  <FontAwesome6 name='user-circle' size={30} color={'rgba(211, 0, 0, 1)'} />
                  <Text style={{fontSize: 16, color: 'rgba(211, 0, 0, 1)', fontWeight: 700}}>{item.name}</Text>
                </View>
                <Text style={{color: 'rgba(211, 0, 0, 1)', fontSize: 16, fontWeight: 700}}>Rs. {item.amount}</Text>
              </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <Modal
          visible={formType !== ''}
          transparent={true}
          animationType='fade'
          onRequestClose={()=>{
            setFormType('');
          }}>
            <View style={styles.back}>
              {{
                Cash: 
                  <View style={styles.form}>
                    <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 24, marginBottom: 40, }}>CASH IN</Text>
                    <Text style={[{color: 'rgb(0,0,0)', fontSize: 18, fontWeight: '700'}]}>Cash</Text>
                      <TextInput style={[styles.input, {outline: 'none'}]} onChangeText={(text) => setCash(parseFloat(text))} value={cash.toString()} keyboardType='numeric'/>
                    <Text style={[{color: 'rgb(0,0,0)', fontSize: 18, fontWeight: '700'}]}>Date</Text>
                    { !mobile ?

                      <input type="date" value={date instanceof Date && !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : ''}
                      onChange={(e) => setDate(new Date(e.target.value))} style={{ borderBottomColor: '#000', height: 40, borderBottomWidth: 1, borderInlineWidth: 0, borderTopWidth: 0, marginBottom: 20,  fontFamily: 'Arial'}}/>
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
                    <TouchableOpacity onPress={() => {setFormType(''); updateCash();}} style={{width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 191, 0, 1)', borderRadius: 20, padding: 10, marginBlock: 20}}>
                      <Text style={styles.text}>Confirm</Text>
                    </TouchableOpacity>
                  </View>,
                Card:
                  <View style={styles.form}>
                    <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 24, marginBottom: 30, }}>WALLET</Text>
                    <Text style={[{color: 'rgb(0,0,0)', fontSize: 18, fontWeight: '700'}]}>Name</Text>
                    <TextInput style={[styles.input, {outline: 'none'}]} value={name} onChangeText={setName}/>
                    <Text style={[{color: 'rgb(0,0,0)', fontSize: 18, fontWeight: '700'}]}>Cash In</Text>
                    <TextInput style={[styles.input, {outline: 'none'}]} value={cash.toString()} onChangeText={(text) => setCash(parseInt(text))} keyboardType='numeric'/>
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
                    <Text style={[{color: 'rgb(0,0,0)', fontSize: 18, fontWeight: '700'}]}>House</Text>
                    <TouchableOpacity style={[styles.input, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}]} onPress={() => setDropDownType('House')}>
                      <Text style={{color: 'rgb(0,0,0)'}}>
                        { house.find(h => h.code === home)?.name || 'All Houses'}
                      </Text>
                      <Ionicons name='chevron-down' size={20} color={'rgb(0,0,0)'}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => add()} style={{width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 187, 0, 1)', borderRadius: 20, padding: 10, marginTop: 20}}>
                      <Text style={styles.text}>Confirm</Text>
                    </TouchableOpacity>
                  </View>,
                Record:
                  <View style={styles.form}>
                    <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 24, marginBottom: 30, }}>Records</Text>
                    <Text style={[{color: 'rgb(0,0,0)', fontSize: 18, fontWeight: '700'}]}>Name</Text>
                    <TextInput style={[styles.input, {outline: 'none'}]} value={name} onChangeText={setName}/>
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
                        <Text style={[styles.text, {marginInline: 0}]}>Out</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => saveRecord('In')} style={{ width: '40%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(26, 173, 0, 1)', borderRadius: 20, paddingInline: 10, paddingBlock: 5,}}>
                        <Text style={[styles.text, {marginInline: 0}]}>In</Text>
                      </TouchableOpacity>
                    </View>
                    :
                    <View style={[styles.row, { justifyContent: 'space-around', marginTop: 20 }]}>
                      <TouchableOpacity onPress={() => updateRecord('Out')} style={{ width: '40%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 0, 0, 1)', borderRadius: 20, paddingBlock: 5,}}>
                        <Text style={[styles.text, {marginInline: 0}]}>Out</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => updateRecord('In')} style={{ width: '40%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(26, 173, 0, 1)', borderRadius: 20, paddingBlock: 5,}}>
                        <Text style={[styles.text, {marginInline: 0}]}>In</Text>
                      </TouchableOpacity>
                    </View>
                    }
                  </View>,
                Transaction:    
                  <View style={styles.form}>
                    <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 24, marginBottom: 30, }}>Transaction</Text>
                    <Text style={[{color: 'rgb(0,0,0)', fontSize: 18, fontWeight: '700'}]}>Name</Text>
                    <TextInput style={[styles.input, {outline: 'none'}]} value={name} onChangeText={setName}/>
                    <Text style={[{color: 'rgb(0,0,0)', fontSize: 18, fontWeight: '700'}]}>Cash</Text>
                    <TextInput style={[styles.input, {outline: 'none'}]} value={cash.toString()} onChangeText={(e) => setCash(parseInt(e))}/>
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
                          <TouchableOpacity onPress={() => saveTransaction("Out") } style={{width: '40%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 0, 0, 1)', borderRadius: 20, padding: 5}}>
                            <Text style={[styles.text, {marginInline: 0}]}>Out</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => saveTransaction("In")} style={{width: '40%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(54, 163, 0, 1)', borderRadius: 20, padding: 5}}>
                            <Text style={[styles.text, {marginInline: 0}]}>In</Text>
                          </TouchableOpacity>
                        </View>
                        :
                        <View style={[styles.row, { justifyContent: 'space-around', marginTop: 20 }]}>
                          <TouchableOpacity onPress={() => updateTransaction("Out") } style={{width: '40%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 0, 0, 1)', borderRadius: 20, padding: 5}}>
                            <Text style={styles.text}>Out</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => updateTransaction("In")} style={{width: '40%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(54, 163, 0, 1)', borderRadius: 20, padding: 5}}>
                            <Text style={styles.text}>In</Text>
                          </TouchableOpacity>
                        </View>
                    }
                   </View>
              }[formType]}

              <TouchableOpacity 
              onPress={() =>{ setFormType('') }} 
              style={{borderRadius: 50, backgroundColor: 'rgba(48, 47, 47, 0.51)', justifyContent:'center', alignItems: 'center',}}>
                <Ionicons name='close' style={{ color: '#ffffffff', textAlign: 'center', fontSize: 32, padding: 10 }}/>
              </TouchableOpacity>
            </View>
        </Modal>    

      <Modal
        visible={dropDownType !== ''}
        animationType='slide'
        transparent={true}
        onRequestClose={() =>
          setDropDownType('')
        }>
          {{
            Wallet:
              <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={styles.dropDown}>
                  <TouchableOpacity onPress={() => {
                            setId('main');
                            setIndex(wallets.findIndex(w => w.id === id));
                            setDropDownType('')}} style={{ padding: 10, borderBottomColor: '#ddd', borderBottomWidth: 1 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 24}}>Wallets</Text>
                  </TouchableOpacity>
                  <FlatList
                        data={wallets}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity onPress={() => {
                            setWalletid(item.id);
                            setIndex(wallets.findIndex(w => w.id === item.id));
                            setDropDownType('');
                          }} style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15, borderBottomColor: '#ddd', borderBottomWidth: 1}}>
                            { item.id === Walletid ?
                            <MaterialCommunityIcons name="circle-slice-8" style={{fontSize: 20, color: 'rgb(7, 180, 48)', paddingRight: 10}}/>
                            :
                            <MaterialCommunityIcons name="circle-outline" style={{fontSize: 20, color: 'rgb(7, 180, 48)', paddingRight: 10}}/>
                            }
                            <Text style={{fontSize: 18}}>{item.name}</Text>
                          </TouchableOpacity>
                        )}
                      />
                </View>
              </View>,
            Delete: 
              <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={styles.delete}>
                  <TouchableOpacity onPress={() => {
                    setDropDownType('');
                  }} style={{ padding: 10, marginBottom: 20 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 24}}>Delete Transaction</Text>
                  </TouchableOpacity>
                  <View style={[styles.row, { justifyContent: 'space-between', gap: 80,  marginTop: 20 }]}>
                    <TouchableOpacity onPress={() => setDropDownType('')} style={{ backgroundColor: 'rgba(31, 50, 255, 0.96)', paddingInline: 20, paddingBlock: 5, borderRadius: 20, marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <MaterialIcons name='cancel' size={20} color={'#fff'} />
                      <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                      setDropDownType('');
                      remove(deleteType);
                    }} style={{ backgroundColor: 'rgba(255, 0, 0, 1)', paddingInline: 20, paddingBlock: 5, borderRadius: 20, marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <MaterialIcons name='delete' size={20} color={'#fff'} />
                      <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>,
            House:
            <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={styles.dropDown}>
                <TouchableOpacity onPress={() => handleHouseSelect("All Houses")}>
                  <Text style={{ fontWeight: "bold", fontSize: 24}}>Home</Text>
                </TouchableOpacity>

                <FlatList
                      data={house}
                      keyExtractor={(item) => item.name}
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
          }[dropDownType]}
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    maxWidth: 450,
    width: '110%',
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
    marginBlock: 20,
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
    gap: 20,
  }, 
  input: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
    outline: 'none',
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
  dropDown: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 10,
    width: '80%',
    maxWidth: 350,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    zIndex: 100,
  },
  delete: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
    padding: 10,
  }
})