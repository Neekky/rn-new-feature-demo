import React from 'react';
import {Button, View, Text} from 'react-native';

export default function Feed(props: any) {
  const {navigation} = props;
  return (
    <View>
      <Text>Feed</Text>
      <Button
        onPress={() => navigation.navigate('Article')}
        title="Go to Article"
      />
    </View>
  );
}
