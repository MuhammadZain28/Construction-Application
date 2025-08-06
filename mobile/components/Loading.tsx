import React from 'react';
import { StyleSheet, View, Text, TextInput} from 'react-native';

export default function Loading({ wallet }: { wallet: boolean }) {
    const height = window.innerHeight;

  return (
    <View style={{backgroundColor: '#dbdbdbff', height: height, flex: 1}}>
        <View style={[styles.head, { backgroundColor: 'rgb(185, 185, 185)' }]}>
        </View>
      { !wallet ?
      <View style={styles.main}>
        <View style={styles.header}>
          <View style={[styles.card, {backgroundColor: 'rgba(185, 185, 185, 1)'}]}>
          </View>
          <View style={[styles.card, {backgroundColor: 'rgba(185, 185, 185, 1)'}]}>
          </View>
        </View>
        <View style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',  padding: 20}}>
            <Text style={{fontSize: 24, fontWeight: 'bold', }}> </Text>
          </View>
          <View style={styles.searchBar}>
            <TextInput style={styles.searchInput} />
          </View>
          <View>
          </View>
        </View>
      </View>
      :
      <View style={styles.main}>
        <View style={{ justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 10, width: '100%', paddingBlock: 10 }}>
          <View style={{backgroundColor: 'rgba(185, 185, 185, 1)', width: 450, height: 220, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 2}}>
          </View>
          <View style={[{ width: '100%', justifyContent: 'center', alignItems: 'center' }]}>
            <View style={{backgroundColor: 'rgba(185, 185, 185, 1)', height: 76, width: 76, borderRadius: 50, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2}}/>
          </View>
        </View>
        <View style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',  padding: 20}}>
            <Text style={{fontSize: 24, fontWeight: 'bold', }}> </Text>
          </View>
          <View style={styles.searchBar}>
            <TextInput style={styles.searchInput} />
          </View>
          <View>
          </View>
        </View>
      </View>
      }
    </View>
  );
}
const styles = StyleSheet.create({
    head: {
    height: 60,
    width: '100%',
    },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '100%',
    gap: 20,
    paddingBlock: 20,
  },
  card: {
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
  main: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#efefefff',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingInline: 10,
  },
  container: {
    flex: 1,
    height: 700,
    flexDirection: 'column',
    padding: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'rgba(185, 185, 185, 1)',
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