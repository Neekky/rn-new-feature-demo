import React, {useState} from 'react';
import {Text, View} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function App() {
  const [logs, setLogs] = useState<string[]>([]);

  const [moveRecord, setMoveRecord] = useState({x: 0, y: 0});

  const singleTap = Gesture.Tap()
    // 渲染
    .onStart(() => runOnJS(setLogs)(logs.concat('开始触发轻按事件')));
  // 动画或日志
  // .onStart(() => {
  //   logs.push('开始触发轻按事件');
  //   setLogs(logs);
  //   console.log('开始触发轻按事件');
  // });

  // 小球动画相关定义
  const isPressed = useSharedValue(false);

  const offsetX = useSharedValue(0);

  const offsetY = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateX: offsetX.value}, {translateY: offsetY.value}],
      backgroundColor: isPressed.value ? 'blue' : '#ccc',
    };
  });

  // wx抽屉动画相关定义
  const wxIsPressed = useSharedValue(false);

  const wxOffsetX = useSharedValue(0);

  const wxStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateX: offsetX.value}, {translateY: offsetY.value}],
      backgroundColor: wxIsPressed.value ? '#ddd' : '#eee',
    };
  });

  // 圆球拖动动画
  const dragGesture = Gesture.Pan()
    .onBegin(() => {
      setMoveRecord({
        x: offsetX.value,
        y: offsetY.value,
      });
      isPressed.value = true;
    })
    .onTouchesDown(() => {})
    .onTouchesMove(() => {})
    .onStart(() => {})
    .onUpdate(() => {})
    .onChange(e => {
      offsetX.value = e.changeX + offsetX.value;
      offsetY.value = e.changeY + offsetY.value;
    })
    .onTouchesUp(() => {})
    .onEnd(e => {
      const xDis = Math.abs(e.x) - Math.abs(moveRecord.x);
      const yDis = Math.abs(e.y) - Math.abs(moveRecord.y);
      const distance = Math.sqrt(Math.pow(xDis, 2) + Math.pow(yDis, 2));
      if (distance < 250) {
        offsetX.value = withSpring(moveRecord.x);
        offsetY.value = withSpring(moveRecord.y);
      }
      isPressed.value = false;
    })
    .onTouchesCancelled(() => {})
    .onFinalize(() => {});

  // 模拟wx删除消息动画功能
  const wxDel = Gesture.Pan()
    .onBegin(() => {
      console.log("开始滑动")
    })
    .onTouchesDown(() => {})
    .onTouchesMove(() => {})
    .onStart(() => {})
    .onUpdate(() => {})
    .onChange(e => {})
    .onTouchesUp(() => {})
    .onEnd(e => {})
    .onTouchesCancelled(() => {})
    .onFinalize(() => {});

  return (
    <SafeAreaView>
      <GestureDetector gesture={dragGesture}>
        <View style={{backgroundColor: '#ddd', position: 'absolute'}}>
          <View style={[{width: 100, height: 100, backgroundColor: 'red'}]} />
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: 100,
                height: 100,
                borderRadius: 100,
              },
              animatedStyles,
            ]}
          />
        </View>
      </GestureDetector>
      {/* wx模块 */}
      <GestureDetector gesture={wxDel}>
        <View
          style={{
            backgroundColor: '#ddd',
            width: '100%',
            position: 'absolute',
            top: 300,
          }}>
          <View
            style={[{width: '100%', height: 100, backgroundColor: 'red'}]}
          />
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: 100,
                height: 100,
                borderRadius: 100,
                backgroundColor: '#ddd',
              },
            ]}
          />
        </View>
      </GestureDetector>
      {logs.map((log, index) => (
        <Text key={index}>{log}</Text>
      ))}
    </SafeAreaView>
  );
}
