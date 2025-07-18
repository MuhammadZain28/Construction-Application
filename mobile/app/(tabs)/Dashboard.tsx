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
            style={[styles.container, {backgroundColor: 'rgba(245, 195, 58, 1)'}]}>
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
              <MaterialIcons name='pending-actions' style={{fontSize: 42, color: 'rgba(245, 195, 58, 1)'}}></MaterialIcons>
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
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 5, margin: 5, backgroundColor: '#f9b728ff', borderRadius: 10, borderBottomWidth: 2, borderColor: '#000'}}>
              <MaterialIcons name='bar-chart' size={36}/>
              <Text style={styles.sectionText}>Overview</Text>
            </View> 
            <View style={styles.barChart}>
              <View style={styles.x}>
                <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>1</Text>
                <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>2</Text>
                <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>3</Text>
                <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>4</Text>
                <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>5</Text>
                <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>6</Text>
                <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>7</Text>
                <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>8</Text>
                <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>9</Text>
                <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>10</Text>
                <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>11</Text>
                <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>12</Text>
              </View>
              <View style={styles.chart}>
                <View style={[styles.bar, {width: 200}]}></View>
                <View style={[styles.bar, {width: 100}]}></View>
                <View style={[styles.bar, {width: 400}]}></View>
                <View style={[styles.bar, {width: 100}]}></View>
                <View style={[styles.bar, {width: 750}]}></View>
                <View style={[styles.bar, {width: 500}]}></View>
                <View style={[styles.bar, {width: 700}]}></View>
                <View style={[styles.bar, {width: 500}]}></View>
                <View style={[styles.bar, {width: 600}]}></View>
                <View style={[styles.bar, {width: 400}]}></View>
                <View style={[styles.bar, {width: 700}]}></View>
                <View style={[styles.bar, {width: 300}]}></View>
              </View>
            </View>
          </View>
          <View style={{flex: 1, gap: 10, alignItems: 'stretch', justifyContent: 'space-between'}}>
            <View style={styles.sidebar}>
              <Text style={styles.sectionText}>🏗️ &nbsp; Material</Text>
              <Text style={styles.cardtext}>Remaining</Text>
              <Text style={styles.cardnumber}>0</Text>
              <Text style={styles.cardtext}>Used</Text>
              <Text style={styles.cardnumber}>0</Text>
            </View>
            <View style={styles.sidebar}>
              <Text style={styles.sectionText}>🎨 &nbsp; Paints</Text>
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
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  chart: {
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#000',
    marginInline: 10,
    gap: 10,
  },
  bar: {
    backgroundColor: '#ffbf00ff',
    borderRadius: 10,
    height: 25,
    marginInline: 5,
  },
  x: {
    gap: 15,
  },
});
