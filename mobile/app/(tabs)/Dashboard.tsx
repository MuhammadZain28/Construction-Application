import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useDataContext } from './DataContext';
  
const Dashboard: React.FC = () => {
  const {houses, transactions, materials, paints, record, paintSum, materialSum} = useDataContext();
  const [mobile, setMobile] = React.useState(false);
  const [materialProgress, setMaterialProgress] = React.useState(0);
  const [paintProgress, setPaintProgress] = React.useState(0);
  const [spend, setSpend] = React.useState(0);

  const totalOut = React.useMemo(() => {
  return transactions
    .filter((transaction) => transaction.type === 'Out')
    .reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  const totalNegativeRecord = React.useMemo(() => {
    return record
      .filter((r) => r.amount <= 0)
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [record]);

  
  const totalIn = React.useMemo(() => {
  return transactions
    .filter((transaction) => transaction.type === 'In')
    .reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  const totalRecord = React.useMemo(() => {
    return record
      .filter((r) => r.amount > 0)
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [record]);

  const remaining = React.useMemo(() => {
    return spend - totalOut - totalNegativeRecord;
  }, [spend, totalOut, totalNegativeRecord]);

  const ConmpletedHouses = React.useMemo(() => {
    return houses.filter((house) => house.completed === true).length;
  }, [houses]);

  const PendingHouses = React.useMemo(() => {
    return houses.filter((house) => house.completed === false).length - 1;
  }, [houses]);

    React.useEffect(() => {
      if (Platform.OS === 'android') {
        setMobile(true);
      }

    }, []);

    React.useEffect(() => {
      const totalMaterials = materials.length;
      const usedMaterials = materials.filter(m => m.used === false).length;
      setMaterialProgress((usedMaterials / totalMaterials) * 100);

      const totalPaints = paints.length;
      const usedPaints = paints.filter(p => p.used === false).length;
      setPaintProgress((usedPaints / totalPaints) * 100);
      let totalSpend = 0;
      for (let i = 1; i <= 12; i++) {
        const month = `${i}`;
        totalSpend += materialSum[`2025-${month.padStart(2, '0')}`] + paintSum[`2025-${month.padStart(2, '0')}`];
      }
      setSpend(totalSpend);

    }, [materials, paints, materialSum, paintSum]);

  return (
    <ScrollView>
      <View style={styles.main}>
        <View style={styles.top}>
          <View
            style={[styles.container, {backgroundColor: 'rgba(245, 174, 22, 1)'}]}>
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
            <Text style={styles.number}>{PendingHouses}</Text>
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
            <Text style={styles.number}>{ConmpletedHouses}</Text>
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
            <Text style={styles.number}>Rs.  {totalIn + totalRecord}</Text>
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
            <Text style={styles.number}>Rs.  { remaining }</Text>
          </View>
        </View>
        <View style={{flexDirection: mobile ? 'column' : 'row', gap: 10, margin: 10, alignItems: 'stretch', justifyContent: 'space-between'}}>
          <View style={styles.table}>
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 5, margin: 5, backgroundColor: '#ffffffff', borderBottomLeftRadius: 20, borderBottomWidth: 2, borderColor: '#000000ff'}}>
              <MaterialIcons name='bar-chart' size={36} color={'rgba(0, 0, 0, 1)'}/>
              <Text style={[styles.sectionText, {color: 'rgba(0, 0, 0, 1)',}]}>Overview</Text>
            </View>
            <View style={styles.barChart}>
              <View style={styles.x}>
                <View style={{flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>Jan</Text>
                  <Text>-</Text>
                </View>
                <View style={{flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>Feb</Text>
                  <Text>-</Text>
                </View>
                <View style={{flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>Mar</Text>
                  <Text>-</Text>
                </View>
                <View style={{flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>Apr</Text>
                  <Text>-</Text>
                </View>
                <View style={{flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>May</Text>
                  <Text>-</Text>
                </View>
                <View style={{flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>Jun</Text>
                  <Text>-</Text>
                </View>
                <View style={{flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>Jul</Text>
                  <Text>-</Text>
                </View>
                <View style={{flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>Aug</Text>
                  <Text>-</Text>
                </View>
                <View style={{flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>Sep</Text>
                  <Text>-</Text>
                </View>
                <View style={{flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>Oct</Text>
                  <Text>-</Text>
                </View>
                <View style={{flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>Nov</Text>
                  <Text>-</Text>
                </View>
                <View style={{flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{height: 20, justifyContent: 'center', alignItems: 'center'}}>Dec</Text>
                  <Text>-</Text>
                </View>
              </View>
              <View style={{width: mobile ? '85%' : '95%'}}>
                <View style={styles.chart}>
                  <View style={styles.progressBar}>
                    <View style={[styles.bar, {width: `${(paintSum['2025-01'] + materialSum['2025-01']) / 50000 * 100}%`}]}>
                      <Text style={styles.graphText}>Rs. {paintSum['2025-01'] + materialSum['2025-01']}</Text>
                    </View>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.bar, {width: `${(paintSum['2025-02'] + materialSum['2025-02']) / 50000 * 100}%`}]}>
                      <Text style={styles.graphText}>Rs. {paintSum['2025-02'] + materialSum['2025-02']}</Text>
                    </View>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.bar, {width: `${(paintSum['2025-03'] + materialSum['2025-03']) / 50000 * 100}%`}]}>
                      <Text style={styles.graphText}>Rs. {paintSum['2025-03'] + materialSum['2025-03']}</Text>
                    </View>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.bar, {width: `${(paintSum['2025-04'] + materialSum['2025-04']) / 50000 * 100}%`}]}>
                      <Text style={styles.graphText}>Rs. {paintSum['2025-04'] + materialSum['2025-04']}</Text>
                    </View>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.bar, {width: `${(paintSum['2025-05'] + materialSum['2025-05']) / 50000 * 100}%`}]}>
                      <Text style={styles.graphText}>Rs. {paintSum['2025-05'] + materialSum['2025-05']}</Text>
                    </View>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.bar, {width: `${(paintSum['2025-06'] + materialSum['2025-06']) / 50000 * 100}%`}]}>
                      <Text style={styles.graphText}>Rs. {paintSum['2025-06'] + materialSum['2025-06']}</Text>
                    </View>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.bar, {width: `${(paintSum['2025-07'] + materialSum['2025-07']) / 50000 * 100}%`}]}>
                      <Text style={styles.graphText}>Rs. {paintSum['2025-07'] + materialSum['2025-07']}</Text>
                    </View>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.bar, {width: `${(paintSum['2025-08'] + materialSum['2025-08']) / 50000 * 100}%`}]}>
                      <Text style={styles.graphText}>Rs. {paintSum['2025-08'] + materialSum['2025-08']}</Text>
                    </View>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.bar, {width: `${(paintSum['2025-09'] + materialSum['2025-09']) / 50000 * 100}%`}]}>
                      <Text style={styles.graphText}>Rs. {paintSum['2025-09'] + materialSum['2025-09']}</Text>
                    </View>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.bar, {width: `${(paintSum['2025-10'] + materialSum['2025-10']) / 50000 * 100}%`}]}>
                      <Text style={styles.graphText}>Rs. {paintSum['2025-10'] + materialSum['2025-10']}</Text>
                    </View>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.bar, {width: `${(paintSum['2025-11'] + materialSum['2025-11']) / 50000 * 100}%`}]}>
                      <Text style={styles.graphText}>Rs. {paintSum['2025-11'] + materialSum['2025-11']}</Text>
                    </View>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.bar, {width: `${(paintSum['2025-12'] + materialSum['2025-12']) / 50000 * 100}%`}]}>
                      <Text style={styles.graphText}>Rs. {paintSum['2025-12'] + materialSum['2025-12']}</Text>
                    </View>
                  </View>
                </View>
                <View style={{flexDirection: 'row', paddingHorizontal: 0, justifyContent: 'space-between', backgroundColor: '#ffffffff', borderTopWidth: 2, borderTopColor: '#000000ff'}}>
                  <View style={{width: 40, alignItems: 'center',}}>
                    <Text style={{fontSize: 10}}>|</Text>
                    <Text >0</Text>
                  </View>
                  <View style={{width: 40, alignItems: 'center',}}>
                    <Text style={{fontSize: 10}}>|</Text>
                    <Text >10000</Text>
                  </View>
                  <View style={{width: 40, alignItems: 'center',}}>
                    <Text style={{fontSize: 10}}>|</Text>
                    <Text >20000</Text>
                  </View>
                  <View style={{width: 40, alignItems: 'center',}}>
                    <Text style={{fontSize: 10}}>|</Text>
                    <Text >30000</Text>
                  </View>
                  <View style={{width: 40, alignItems: 'center',}}>
                    <Text style={{fontSize: 10}}>|</Text>
                    <Text >40000</Text>
                  </View>
                  <View style={{width: 40, alignItems: 'center',}}>
                    <Text style={{fontSize: 10}}>|</Text>
                    <Text >50000</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={{flex: 1, gap: 10, alignItems: 'stretch', justifyContent: 'space-between'}}>
            <View style={styles.sidebar}>
              <View style={{flexDirection: 'row', alignItems: 'center', padding: 5, margin: 5, backgroundColor: '#ffffffff', borderBottomLeftRadius: 20, borderBottomWidth: 2, borderColor: 'rgba(0, 0, 0, 1)', width: '40%'}}>
                <MaterialIcons name='format-paint' size={36} color={'rgba(0, 0, 0, 1)'}/>
                <Text style={styles.sectionText}> Products</Text>
              </View>
              <View style={styles.pieChart}>
                <View style={styles.pie}>
                  <CircularProgress radius={95} stroke={10} progress={materialProgress}></CircularProgress>
                  <Text style={styles.pieText}>Materials</Text>
                </View>
                <View style={styles.pie}>
                  <CircularProgress radius={75} stroke={10} progress={paintProgress}></CircularProgress>
                  <Text style={[styles.pieText, {bottom: 35}]}>Paints</Text>
                </View>
                <View style={{flexDirection: 'row', marginLeft: 160, marginTop: -50, gap: 5}}>
                  <Text style={{fontSize: 12, fontWeight: 'bold'}}>{materialProgress.toPrecision(2)}%</Text>
                  <Text style={{fontSize: 12, fontWeight: 'bold'}}>{paintProgress.toPrecision(2)}%</Text>
                </View>
              </View>
              <View style={{display: 'flex', flex: 1, padding: 10, gap: 20}}>
                <View style={{gap: 5, borderWidth: 2, borderColor: '#000000ff', backgroundColor: '#000000ff', borderRadius: 10, padding: 10}}>
                  <Text style={{fontSize: 18, fontWeight: 'bold', color: '#ffffff'}}>Materials</Text>
                  <Text style={{fontSize: 16, fontWeight: 'bold', paddingHorizontal: 10, color: '#ffffff'}}>Types : </Text>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 5}}>
                    <Text style={{fontSize: 14, fontWeight: 'bold', color: '#ffffff'}}>Remaining : {materials.filter(m => m.used === false).length}</Text>
                    <Text style={{fontSize: 14, fontWeight: 'bold', color: '#ffffff'}}>Used : {materials.filter(m => m.used === true).length}</Text>
                  </View>
                </View>
                <View>
                <View style={{gap: 5, borderWidth: 2, borderColor: '#000000ff', backgroundColor: '#000000ff', borderRadius: 10, padding: 10}}>
                  <Text style={{fontSize: 18, fontWeight: 'bold', color: '#ffffff'}}>Paints</Text>
                  <Text style={{fontSize: 16, fontWeight: 'bold', paddingHorizontal: 10, color: '#ffffff'}}>Types : </Text>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 5}}>
                    <Text style={{fontSize: 14, fontWeight: 'bold', color: '#ffffff'}}>Remaining : {paints.filter(p => p.used === false).length}</Text>
                    <Text style={{fontSize: 14, fontWeight: 'bold', color: '#ffffff'}}>Used : {paints.filter(p => p.used === true).length}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  </ScrollView>
  );
};
export default Dashboard;

const CircularProgress = ({ radius = 60, stroke = 10, progress = 70 }) => {
  progress *= 0.75;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset = circumference - (circumference * progress) / 100;
  const percentage = circumference - (circumference * 75) / 100;
  return (
    <Svg
      height={radius * 2}
      width={radius * 2}
      style={{ transform: [{ rotateY: '180deg' }] }} 
    >
      <Circle
        stroke="#e6e6e6"
        fill="none"
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={percentage}
        strokeLinecap="round"
        rotation="-90"
        originX={radius}
        originY={radius}
      />

      <Circle
        stroke="#000000ff"
        fill="none"
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        rotation="-90"
        originX={radius}
        originY={radius}
      />
    </Svg>
  );
};

export { CircularProgress };
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
    backgroundColor: '#efefefff',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 1)',
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
    alignItems: 'stretch',
    padding: 10,
    width: '100%',
  },
  chart: {
    borderLeftWidth: 2,
    borderColor: '#000',
    gap: 10,
    paddingBottom: 10,
    marginTop: 20,
  },
  bar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000ff',
    borderRadius: 10,
    height: 25,
  },
  x: {
    marginTop: 20,
    gap: 15,
    width: '5%',
    minWidth: 40,
  },
  pieChart: {
    position: 'relative',
    height: '50%',
    minHeight: 270,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pie: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieText: {
    color: '#000000ff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  graphText: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBar: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#ffffffff',
    width: '95%',
    marginHorizontal: '2%'
  },
});