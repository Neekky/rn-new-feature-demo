import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Feed from '../components/Feed';
import Article from '../components/Article';

const Drawer = createDrawerNavigator();

export default function Index() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'left',
        headerShown: false,
        drawerType: 'slide',
        drawerStatusBarAnimation: 'fade',
      }}
      initialRouteName="Feed">
      <Drawer.Screen name="Feed" component={Feed} />
      <Drawer.Screen name="Article" component={Article} />
    </Drawer.Navigator>
  );
}
