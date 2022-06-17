import React from 'react';
import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {module1} from '../../../../route';

export default function HomePage(props: Iprops) {
  const {navigation} = props;

  const pagePush = (pageName, params = {}) => {
    navigation.push(pageName, params);
  };
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollview}
        contentContainerStyle={styles.scrollviewInner}>
        {module1.map(routes => {
          return (
            <TouchableOpacity
              onPress={() => {
                pagePush(routes.name);
              }}>
              <View style={styles.routeCard} key={routes.name}>
                <Text>{routes.name}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
  },
  scrollviewInner: {
    alignItems: 'center',
  },
  routeCard: {
    width: 300,
    height: 40,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
});
