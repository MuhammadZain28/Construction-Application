import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useDataContext } from '@/app/(tabs)/DataContext';

interface HeaderProps {
  icon: string;
  name: string;
}

const Header: React.FC<HeaderProps> = ({icon, name}) => {
    const { setIsHouseUpdated, setIsMaterialUpdated, setIsPaintUpdated, setIsTransactionUpdated, setIsWalletUpdated, setIsRecordUpdated} = useDataContext();
    const handleReload = () => {
        name === 'House' && setIsHouseUpdated(true);
        name === 'Material' && setIsMaterialUpdated(true);
        name === 'Paints' && setIsPaintUpdated(true);
        if (name === 'Wallets') {
            setIsWalletUpdated(true);
            setIsTransactionUpdated(true);
            setIsRecordUpdated(true);
        }
    }
    const colorScheme = useColorScheme();
    return (
        <View style={[styles.header, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            <MaterialIcons name={icon as any} size={32} color={Colors[colorScheme ?? 'light'].text} />
            <Text style={[styles.text, { color: Colors[colorScheme ?? 'light'].text }]}>{name}</Text>
            <TouchableOpacity style={styles.reload} onPress={handleReload}><Ionicons name='reload-circle' color={Colors[colorScheme ?? 'light'].text} size={32}/></TouchableOpacity>
        </View>
        );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        height: 60,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    reload: {
        position: 'absolute',
        right: 20,
    }
});

export default Header;