import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screen/HomeScreen'
import RecipeScreen from './screen/RecipeScreen'
import MapScreen from './screen/MapScreen'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if      (route.name === 'Home')   { iconName = 'ios-home';   } 
            else if (route.name === 'Recipe') { iconName = 'ios-book'; } 
            else if (route.name === 'Map') { iconName = 'ios-map';   }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{ 
          showLabel: false, 
          activeTintColor: 'tomato', 
          inactiveTintColor: 'gray'
        }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Recipe" component={RecipeScreen} />
        <Tab.Screen name="Map" component={MapScreen} />


      </Tab.Navigator>
    </NavigationContainer>
  );
}