import React from 'react';
import {View, Text, Button} from 'react-native';

export default function Article(props: any) {
  const {navigation} = props;
  return (
    <View>
      <Text>Article</Text>
      <Button onPress={() => navigation.navigate('Feed')} title="Go to Feed" />
      <Button
        onPress={() => navigation.toggleDrawer()}
        title={'toggle drawer'}
      />
      <Button onPress={() => navigation.openDrawer()} title={'oppen drawer'} />
    </View>
  );
}
