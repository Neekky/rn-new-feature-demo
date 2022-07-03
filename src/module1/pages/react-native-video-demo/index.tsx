import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Button} from 'react-native';
import Video from 'react-native-video';

const {width} = Dimensions.get('window');

export default function Index() {
  const player = useRef<Video>();

  const [isPlaying, setIsPlaying] = useState(false);

  const config = {uri: 'http://192.168.1.11:9999/1656813293057782.mp4'};

  return (
    <View>
      <Video
        source={require('../../../../static/1656813293057782.mp4')} // Can be a URL or a local file.
        ref={player} // Store reference
        // repeat={true}
        controls={true}
        paused={!isPlaying}
        onLoad={e => {
          console.log('视频加载完成', e);
        }}
        onLoadStart={e => {
          console.log('正在加载', e);
        }}

        // onBuffer={this.onBuffer} // Callback when remote video is buffering
        // onError={this.videoError} // Callback when video cannot be loaded
        style={styles.backgroundVideo}
      />

      <Button
        title={`${isPlaying ? '暂停' : '播放'}视频`}
        onPress={() => {
          setIsPlaying(!isPlaying);
        }}></Button>
    </View>
  );
}
var styles = StyleSheet.create({
  backgroundVideo: {
    width,
    height: 200,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
