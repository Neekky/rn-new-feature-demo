import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
} from 'react-native';
const width = Dimensions.get('window').width;

class ListItem extends React.PureComponent<any, any> {
  color: string = '#ffffff';

  onPress = () => {
    this.props.onPressItem(this.props.index);
  };

  render() {
    let color = this.props.selected ? '#f00' : '#ffffff';
    const backStyle = {
      backgroundColor: color,
    };
    return (
      <TouchableHighlight onPress={this.onPress} underlayColor="#dddddd">
        <View style={backStyle}>
          <Text style={styles.item}>{this.props.item}</Text>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    width: width,
    backgroundColor: '#dddddd',
  },
  selected: {
    backgroundColor: '#a9a9a9',
  },
  item: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#48BBEC',
  },
});

export default ListItem;
