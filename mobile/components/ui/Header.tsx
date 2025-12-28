import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
interface HeaderProps {
  icon: string;
  name: string;
}

const Header: React.FC<HeaderProps> = ({icon, name}) => {

    const colorScheme = useColorScheme();
    return (
        <View style={[styles.header, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            <MaterialIcons name={icon as any} size={32} color={Colors[colorScheme ?? 'light'].text} />
            <Text style={[styles.text, { color: Colors[colorScheme ?? 'light'].text }]}>{name}</Text>
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