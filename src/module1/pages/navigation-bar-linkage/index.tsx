/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/require-default-props */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect, memo, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  Animated,
  LayoutAnimation,
  Image,
} from 'react-native';
import _ from 'lodash';
import connor from './img/connor2.png';
import SeriseListItem from './components/seriseListItem';
import fastArrow from './img/fastarrow.png';
import topArrow from './img/topArrow.png';
import fastshadow from './img/fastShadow.png';
import PanelItem from './components/panelItem';
import mockdata from './mock';

const {width} = Dimensions.get('window');

type TData = {id: number | string; name: string; selected?: boolean};

interface IProductListProps {
  productList: TData[];
  cacheSeriesCodeMapData: any;
  isAllSelected: boolean;
  maxHeight: number;
}
interface SeriesItemProps {
  seriesCode?: string;
  id: string | number;
  name: string;
  type: string;
  handleProductPress: (type: string, data: any) => void;
  cacheSeriesCodeMapData: any;
}

export default memo(SeriesProductList);

function SeriesProductList(props: IProductListProps) {
  const {
    productList = mockdata.data,
    cacheSeriesCodeMapData = {},
    isAllSelected = false,
    maxHeight,
  } = props;

  const flatlistRef = useRef<FlatList>();

  const scrollviewRef = useRef<ScrollView>();

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

  // 当由flatlist滑动造成index变化、快筛点击造成index变化时，要进行判断
  useEffect(() => {
    if (isClickScroll) {
      setTrulySeriesId(clickSeriesId);
    } else {
      setTrulySeriesId(curSeriesId);
    }
  }, [curSeriesId, clickSeriesId, isClickScroll]);

  const onViewRef = useRef(({viewableItems}) => {
    // 获取可见区域第一项
    const firstItem = viewableItems[0];
    if (firstItem.item.type === 'header') {
      setCurSeriesId(firstItem.item.id);
    }
  });

  const flag = Array.isArray(productList?.slice(0));

  const viewConfigRef = useRef({
    itemVisiblePercentThreshold: 0,
    waitForInteraction: true,
  });

  const handlePress = (item: any) => {
    if (trulySeriesId === item.id) return;
    setIsClickScroll(true);
    setClickSeriesId(item.id);
    setIsShowPanel(false);
    flatlistRef.current &&
      flatlistRef.current.scrollToIndex({
        index: item.index,
        viewOffset: -40,
        viewPosition: 0,
      });
  };

  // 初始list， 未排序
  const [allItemWidthList, setAllItemWidthList] = useState([]);

  // 排序后的list
  const [sortItemWidthList, setSortItemWidthList] = useState<any>({});

  // 设置滑动框最大宽度
  const [maxWidth, setMaxWidth] = useState(0);

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

  const [panelList, setPanelList] = useState<any>([]);

  // 处理数据格式为三组二维数组
  useEffect(() => {
    const temp = _.chunk(seriseList, 3);
    setPanelList(temp);
  }, [seriseList]);

  console.log(mockdata);
  return (
    <View
      style={{
        width,
        alignItems: 'center',
        paddingBottom: 12,
        paddingTop: seriseList.length > 1 ? 0 : 12,
      }}>
      {/* 顶部快筛栏 */}
      {seriseList.length > 1 && (
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              height: 44,
              backgroundColor: '#fff',
            },
            isShowPanel && {
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 0},
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 30,
            },
          ]}>
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
            maxHeight: isShowPanel ? maxHeight : 0,
          },
          isShowPanel && {
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 12},
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 30,
          },
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

      {flag && (
        <Animated.FlatList
          onTouchStart={() => {
            setIsShowPanel(false);
          }}
          onMomentumScrollEnd={() => {
            setIsClickScroll(false);
            // 设置滑动id为实际id
            setCurSeriesId(trulySeriesId);
          }}
          ref={flatlistRef}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          data={productList}
          keyExtractor={item => `${item?.id}`}
          windowSize={11}
          getItemLayout={(data, index) => {
            return {length: 45, offset: 45 * index, index};
          }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <RightSelectItem name="全部" id="all" selected={isAllSelected} />
          }
          renderItem={({item}) => {
            const {seriesCode, title = '', id, type} = item;
            return (
              <OriginSeriesSelectItem
                seriesCode={seriesCode}
                name={title}
                type={type}
                cacheSeriesCodeMapData={cacheSeriesCodeMapData}
                id={id}
              />
            );
          }}
        />
      )}
    </View>
  );
}

interface IRightSelectItemProps {
  name: string;
  id: number | string;
  selected: boolean;
}

const RightSelectItem = memo(OriginRightSelectItem);

function OriginRightSelectItem(props: IRightSelectItemProps) {
  const {name, id, handleProductPress, selected} = props;
  return (
    <TouchableOpacity>
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

// const SeriesSelectItem = memo(OriginSeriesSelectItem);
function OriginSeriesSelectItem(props: SeriesItemProps) {
  const {
    name = '',
    seriesCode = '',
    id,
    type,
    cacheSeriesCodeMapData = {},
  } = props;
  const {isSeriesAllSelected = false, selectProductIds = []} =
    cacheSeriesCodeMapData[seriesCode] || {};
  return (
    <View>
      {type === 'header' ? (
        <View style={styles.seriesTitle}>
          <Pressable style={styles.seriesNameWrap}>
            <View style={styles.point} />
            <Text style={styles.seriesName}>{name}</Text>
          </Pressable>
          <Pressable
            style={[
              styles.seriesAllSelect,
              isSeriesAllSelected && styles.selectItemActive,
            ]}>
            <Text
              style={[
                styles.seriesAllSelectName,
                isSeriesAllSelected && styles.selectText,
              ]}>
              全部
            </Text>
            {isSeriesAllSelected ? (
              <Image style={styles.connor} source={connor} />
            ) : null}
          </Pressable>
        </View>
      ) : (
        <RightSelectItem
          id={id}
          name={name}
          key={id}
          handleProductPress={() => {
            handleProductPress('product', {id, name, seriesCode});
          }}
          selected={selectProductIds.includes(id)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panelExpand: {
    marginTop: 2,
    position: 'absolute',
    top: 42,
    width: '100%',
    zIndex: 9,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingBottom: 12,
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
  selectItemActive: {
    backgroundColor: '#FFF4EE',
    borderColor: '#FF542A',
  },
  selectItemWrapper: {
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: width * 0.685,
    borderWidth: 0.5,
    borderColor: 'transparent',
    backgroundColor: '#F9F9F9',
    borderRadius: 4,
    marginBottom: 8,
    minHeight: 40,
  },
  seriesTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width * 0.685,
    marginBottom: 8,
    minHeight: 28,
  },
  seriesNameWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  point: {
    width: 4,
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    marginRight: 4,
  },
  seriesName: {
    fontSize: 14,
    fontWeight: '600',
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
});
