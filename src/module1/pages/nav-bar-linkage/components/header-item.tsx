import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';

interface IProps {
  title: string;
  handlePress?: () => void;
  id: number | string;
}

export default function HeaderItem(props: IProps) {
  const {title} = props;
  return (
    <View style={styles.seriesTitle}>
      <TouchableOpacity style={styles.seriesNameWrap}>
        <View style={styles.point} />
        <Text style={styles.seriesName}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  seriesTitle: {
    backgroundColor: '#fff',
    marginBottom: 8,
    paddingHorizontal: 24,
    height: 48,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  seriesNameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seriesName: {
    fontSize: 14,
    fontWeight: '600',
  },
  point: {
    width: 4,
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    marginRight: 4,
  },
});
