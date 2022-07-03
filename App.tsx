import React, {lazy} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {module1} from './route';
const Stack = createNativeStackNavigator();

// 分包测试
const Test = lazy(() => import('./src/module2/test'));

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {module1.map(routeInfo => (
          <Stack.Screen
            name={routeInfo.name}
            component={routeInfo.component}
            options={routeInfo.options}
          />
        ))}
        <Stack.Screen name={'Test'} component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
