import React, {memo} from 'react';
import {TouchableOpacity, StyleSheet, View, Text, Image} from 'react-native';
import connor from '../img/connor2.png';

interface IProps {
  name: string;
  id: number | string;
  selected?: boolean;
  handlePress?: () => void;
}

function OriginListItem(props: IProps) {
  const {name, selected, handlePress} = props;
  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        style={[styles.selectItemWrapper, selected && styles.selectItemActive]}>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[styles.productName, selected && {color: '#FF542A'}]}>
          {name}
        </Text>
        {selected ? <Image style={styles.connor} source={connor} /> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  selectItemWrapper: {
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 0.5,
    borderColor: 'transparent',
    borderRadius: 4,
    marginBottom: 8,
    minHeight: 40,
  },
  selectItemActive: {
    backgroundColor: '#FFF4EE',
    borderColor: '#FF542A',
  },
  productName: {
    fontSize: 14,
    color: '#333',
  },
  connor: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 16,
    height: 16,
  },
});

export const ListItem = memo(OriginListItem);
