import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import MockData from './mock';
const {height, width} = Dimensions.get('window');

const ViewTypes = {
  HEADER: 0,
  LISTITEM: 1,
};

export default function Index() {
  const dp = useRef(
    new DataProvider((r1, r2) => {
      return r1 !== r2;
    }),
  );

  const [data, setData] = useState<DataProvider>(dp.current.cloneWithRows([]));

  const lp = new LayoutProvider(
    i => {
      if (i % 2 === 0) {
        return ViewTypes.HEADER;
      } else {
        return ViewTypes.LISTITEM;
      }
    },
    (...args) => {
      const [type, dim, index] = args;
      switch (type) {
        // 通过定义不同属性，可以实现不同的展示效果，里flatlist的headercomponet，可以通过定义HEADER类型实现
        case ViewTypes.HEADER:
          dim.width = width / 2;
          dim.height = 100;
          break;
        case ViewTypes.LISTITEM:
          dim.width = width;
          dim.height = 50 / 2;
          break;
        default:
          dim.width = width / 2;
          dim.height = 50;
      }
    },
  );

  useEffect(() => {
    const res = dp.current.cloneWithRows(MockData.data);
    setData(res);
  }, []);

  const renderItem = (type, item, index, extendedState) => {
    console.log(item, '111');
    return (
      <View style={{borderBottomColor: '#ddd', borderWidth: 0.5, flex:1, paddingHorizontal: 10}}>
        <Text>{item.title}</Text>
      </View>
    );
  };
  console.log(data);
  return (
    <SafeAreaView style={{flex: 1}} edges={['bottom', 'top']}>
      <RecyclerListView
        style={{flex: 1}}
        dataProvider={data}
        layoutProvider={lp}
        rowRenderer={renderItem}
      />
    </SafeAreaView>
  );
}
