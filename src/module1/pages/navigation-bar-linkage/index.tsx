import React, {useState, useEffect, memo, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ScrollView,
  LayoutAnimation,
  Image,
} from 'react-native';
import _ from 'lodash';
import SeriseListItem from './components/serise-list-item';
import PanelItem from './components/panel-item';
import mockdata from './mock';
import {ListItem} from './components/list-item';
import HeaderItem from './components/header-item';

import fastArrow from './img/fastarrow.png';
import topArrow from './img/topArrow.png';
import fastshadow from './img/fastShadow.png';

const {width} = Dimensions.get('window');

type TData = {id: number | string; name: string; selected?: boolean};

interface IProps {
  productList: TData[];
  isAllSelected: boolean;
}
interface SeriesItemProps {
  seriesCode?: string;
  id: string | number;
  name?: string;
  type?: string;
  title?: string;
  handleProductPress?: (type: string, data: any) => void;
}

const RowRenderer = (props: SeriesItemProps) => {
  const {name = '', id, type, title} = props;
  return type === 'header' ? (
    <HeaderItem id={id} title={title} />
  ) : (
    <ListItem id={id} name={name} key={id} handlePress={() => {}} />
  );
};

const SeriesProductList = (props: IProps) => {
  const {productList = mockdata.data} = props;

  const flatlistRef = useRef<FlatList>();

  const scrollviewRef = useRef<ScrollView>();

  const onViewRef = useRef(({viewableItems}) => {
    // 获取可见区域第一项
    const firstItem = viewableItems[0];
    if (firstItem.item.type === 'header') {
      setCurSeriesId(firstItem.item.id);
    }
  });

  // 列表可见事件配置
  const viewConfigRef = useRef({
    itemVisiblePercentThreshold: 0,
    waitForInteraction: true,
  });

  // 因逻辑问题，变为中间值
  const [curSeriesId, setCurSeriesId] = useState(-1);

  const [seriseList, setSeriesList] = useState([]);

  // 系列ID的实际取值
  const [trulySeriesId, setTrulySeriesId] = useState(-1);

  // 由快筛点击触发的系列ID
  const [clickSeriesId, setClickSeriesId] = useState(-1);

  // 是否为快筛点击触发的滑动
  const [isClickScroll, setIsClickScroll] = useState(false);

  const [scrollViewWidth, setScrollViewWidth] = useState(0);

  // 控制子组件是否打开快筛面板
  const [isShowPanel, setIsShowPanel] = useState(false);

  // 快筛面板数据源
  const [panelList, setPanelList] = useState<any>([]);

  // 初始list， 未排序
  const [allItemWidthList, setAllItemWidthList] = useState([]);

  // 排序后的list
  const [sortItemWidthList, setSortItemWidthList] = useState<any>({});

  // 设置滑动框最大宽度
  const [maxWidth, setMaxWidth] = useState(0);

  // 处理数据源
  useEffect(() => {
    const temp = productList?.filter((ele, i) => {
      if (ele.type === 'header') {
        ele.index = i;
        return true;
      }
      return false;
    });
    setSeriesList(temp);
    setSortItemWidthList([]);
    setAllItemWidthList([]);
  }, [productList]);

  // 处理数据格式为三组二维数组
  useEffect(() => {
    const temp = _.chunk(seriseList, 3);
    setPanelList(temp);
  }, [seriseList]);

  // 当由flatlist滑动造成index变化、快筛点击造成index变化时，要进行判断
  useEffect(() => {
    if (isClickScroll) {
      setTrulySeriesId(clickSeriesId);
    } else {
      setTrulySeriesId(curSeriesId);
    }
  }, [curSeriesId, clickSeriesId, isClickScroll]);

  useEffect(() => {
    // 搜集子项宽度
    const temp: any = [...allItemWidthList];

    // 根据index排序
    temp.sort((a, b) => a.index - b.index);

    // 获取对应位置的宽度、累计宽度信息
    const reduceList: any = {};
    temp.reduce((previousValue, currentValue) => {
      const res = previousValue + currentValue.width;
      reduceList[currentValue.id] = {
        reduceWidth: res,
        originWidth: currentValue.width,
      };
      setMaxWidth(res);
      return res;
    }, 0);

    setSortItemWidthList(reduceList);

    return () => {
      setSortItemWidthList([]);
    };
  }, [allItemWidthList]);

  // 真实ID改变时，触发快筛联动
  useEffect(() => {
    const curItem: any = sortItemWidthList[trulySeriesId];
    scrollviewRef.current &&
      scrollviewRef.current.scrollTo({
        x:
          curItem?.reduceWidth - scrollViewWidth / 2 - curItem?.originWidth / 2,
      });
  }, [trulySeriesId, sortItemWidthList, scrollViewWidth]);

  const getItemWidth = data => {
    setAllItemWidthList([...allItemWidthList, data]);
  };

  const handlePress = (item: any) => {
    if (trulySeriesId === item.id) return;
    setIsClickScroll(true);
    setClickSeriesId(item.id);
    setIsShowPanel(false);
    flatlistRef.current &&
      flatlistRef.current.scrollToIndex({
        index: item.index,
        viewPosition: 0,
      });
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      {/* 顶部快筛栏 */}
      {seriseList.length > 1 && (
        <View style={[styles.fastTagBar, isShowPanel && styles.shadow]}>
          {/* 快筛滑动区域 */}
          <ScrollView
            onLayout={event => {
              const {width} = event.nativeEvent.layout;
              setScrollViewWidth(width);
            }}
            ref={scrollviewRef}
            showsHorizontalScrollIndicator={false}
            horizontal
            style={{
              flex: 1,
              marginLeft: 12,
            }}
            contentContainerStyle={{
              height: 44,
              alignItems: 'center',
            }}>
            {seriseList.map((item, idx) => (
              <SeriseListItem
                getItemWidth={getItemWidth}
                index={idx}
                curSeriesId={trulySeriesId}
                key={item.id}
                handlePress={handlePress}
                item={item}
              />
            ))}
            {/* 占位符 */}
            <View style={{width: 4}} />
          </ScrollView>

          {/* 侧边点击按钮 */}
          {maxWidth > width && (
            <TouchableOpacity
              onPress={() => {
                LayoutAnimation.configureNext({
                  duration: 200,
                  update: {
                    type: LayoutAnimation.Types.easeInEaseOut,
                  },
                });
                setIsShowPanel(!isShowPanel);
              }}>
              <View
                style={{
                  width: 32,
                  height: 36,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={fastshadow}
                  style={{width: 9, height: 44, position: 'absolute', left: -9}}
                />
                <Image
                  source={isShowPanel ? topArrow : fastArrow}
                  style={{width: 12, height: 12}}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}
      {/* 面板展开区 */}
      <View
        style={[
          styles.panelExpand,
          {
            minHeight: isShowPanel ? 180 : 0,
            maxHeight: isShowPanel ? 300 : 0,
          },
          isShowPanel && styles.shadow,
        ]}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}>
          <View style={{height: 2}} />
          {panelList.map(ele => (
            <PanelItem
              maxWidth={width}
              curSeriesId={trulySeriesId}
              handlePress={handlePress}
              key={ele[0].id}
              data={ele}
            />
          ))}
          <View style={{height: 4}} />
        </ScrollView>
      </View>

      <FlatList
        data={productList}
        ref={flatlistRef}
        onMomentumScrollEnd={() => {
          setIsClickScroll(false);
          setCurSeriesId(trulySeriesId);
        }}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        keyExtractor={item => `${item?.id}`}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => {
          const {seriesCode, title = '', id, type, name} = item;
          return (
            <RowRenderer
              seriesCode={seriesCode}
              name={name}
              title={title}
              type={type}
              id={id}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  panelExpand: {
    position: 'absolute',
    top: 42,
    marginTop: 2,
    width: '100%',
    zIndex: 9,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingBottom: 12,
  },
  seriesAllSelect: {
    width: 45,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 4,
  },
  seriesAllSelectName: {
    fontSize: 12,
    color: '#333',
  },
  selectText: {
    color: '#FF542A',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 30,
  },
  fastTagBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 44,
    backgroundColor: '#fff',
  },
});

export default memo(SeriesProductList);
