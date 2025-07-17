import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
const Dashboard: React.FC = () => {
  return (
    <ScrollView>
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Dashboard</Text>
        </View>
        <View style={styles.top}>
          <View
            style={[styles.container, {backgroundColor: 'rgba(251, 192, 30, 1)'}]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.text}>Pending</Text>
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 50,
                  marginHorizontal: 15,
                  marginVertical: 5,
                  padding: 15,
                }}>
              <MaterialIcons name='pending-actions' style={{fontSize: 42, color: 'rgba(250, 192, 30, 1)'}}></MaterialIcons>
              </View>
            </View>
            <Text style={styles.number}>0</Text>
          </View>
          <View
            style={[styles.container, {backgroundColor: 'rgba(15, 151, 37, 1)'}]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.text}>Completed</Text>
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 50,
                  marginHorizontal: 15,
                  marginVertical: 5,
                  padding: 15,
                }}>
                  
              <MaterialIcons name='done-all' style={{fontSize: 42, color: 'rgba(17, 151, 37, 1)'}}></MaterialIcons>
              </View>
            </View>
            <Text style={styles.number}>0</Text>
          </View>
          <View
            style={[styles.container, {backgroundColor: 'rgba(197, 50, 255, 1)'}]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.text}>Revenue</Text>
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 50,
                  marginHorizontal: 15,
                  marginVertical: 5,
                  padding: 15,
                }}>
              <MaterialCommunityIcons name='cash' style={{fontSize: 42, color: 'rgba(195, 53, 251, 1)'}}></MaterialCommunityIcons>
              </View>
            </View>
            <Text style={styles.number}>0</Text>
          </View>
          <View
            style={[styles.container, {backgroundColor: 'rgba(54, 91, 254, 1)'}]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.text}>Spend</Text>
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 50,
                  marginHorizontal: 15,
                  marginVertical: 5,
                  padding: 15,
                }}>
              <MaterialIcons name='receipt-long' style={{fontSize: 42, color: 'rgba(54, 91, 254, 1)'}}></MaterialIcons>
              </View>
            </View>
            <Text style={styles.number}>0</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', gap: 10, margin: 10, alignItems: 'stretch', justifyContent: 'space-between', flexWrap: 'wrap'}}>
          
          <View style={styles.table}>
            <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', gap: 10, backgroundColor: 'rgba(180, 29, 250, 1)', borderTopRightRadius: 10, borderTopLeftRadius: 10, paddingHorizontal: 10, marginBottom: 5}}>
              <Text
                style={[styles.sectionText, {color: 'rgb(255, 255, 255)'}]}
                numberOfLines={1}
                ellipsizeMode="tail">
                Recent Purchases
              </Text>
            </View>
            <View style={{width: '100%', borderRadius: 5, borderWidth: 1, gap: 10, borderColor: 'rgb(255, 255, 255)', marginBottom: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgb(255, 235, 211)', borderRadius: 5,  gap: 0, paddingHorizontal: 10, width: '100%'}}>
                <Text
                  style={{flex: 2, fontSize: 20, width: '50%', paddingInline: 5, fontWeight: 'bold'}}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  --
                </Text>
                <Text
                  style={{flex: 1, fontSize: 20, width: '25%', paddingInline: 5, textAlign: 'center', fontWeight: 'bold'}}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  Rs. 0 
                </Text>
              </View>
            </View>
          </View>
          <View style={{flex: 1, gap: 10, alignItems: 'stretch', justifyContent: 'space-between'}}>
            <View style={styles.sidebar}>
              <View style={{flexDirection: 'row', borderTopRightRadius: 10, borderTopLeftRadius: 10, alignItems: 'center', justifyContent: 'flex-start', gap: 5, paddingHorizontal: 10, paddingVertical: 0, backgroundColor: 'rgba(30, 164, 10, 1)'}}>
                <MaterialIcons name='construction' size={32} color={'rgb(255, 255, 255)'}/>
                <Text style={[styles.sectionText, {color: 'rgb(255, 255, 255)'}]}>Material</Text>
              </View>
              <Text style={styles.cardtext}>Remaining</Text>
              <Text style={styles.cardnumber}>0</Text>
              <Text style={styles.cardtext}>Used</Text>
              <Text style={styles.cardnumber}>0</Text>
            </View>
            <View style={styles.sidebar}>
              <View style={{flexDirection: 'row', borderTopRightRadius: 10, borderTopLeftRadius: 10, alignItems: 'center', justifyContent: 'flex-start', gap: 5, paddingHorizontal: 10, paddingVertical: 0, backgroundColor: 'rgba(27, 0, 161, 1)'}}>
                <MaterialCommunityIcons name='format-paint' size={32} color={'rgb(255, 255, 255)'}/>
                <Text style={[styles.sectionText, {color: 'rgb(255, 255, 255)'}]}>Paints</Text>
              </View>
              <Text style={styles.cardtext}>Remaining</Text>
              <Text style={styles.cardnumber}>0</Text>
              <Text style={styles.cardtext}>Used</Text>
              <Text style={styles.cardnumber}>0</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
export default Dashboard;
const styles = StyleSheet.create({
  header: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
  top: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    margin: 10,
    borderRadius: 10,
  },
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: 'rgb(254, 240, 161)',
    minWidth: 250,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    position: 'relative',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    margin: 10,
  },
  number: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    margin: 10,
    textAlign: 'right',
  },
  table: {
    position: 'relative',
    flex: 2,
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    minWidth: 340,
    borderRadius: 10,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sidebar: {
    position: 'relative',
    flex: 1,
    height: 'auto',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionText: {
    flex: 2,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cardtext: {
    flex: 1,  
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cardnumber: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: 'right',
  },
});
