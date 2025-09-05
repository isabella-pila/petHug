import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CadastrarPetScreen from '../screens/CadastrarPetScreen';


const Stack = createNativeStackNavigator();

export default function StackNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="CadastrarPet" component={CadastrarPetScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );

};
