import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  LayoutAnimation,
} from 'react-native';
import {
  RecyclerListView,
  LayoutProvider,
  DataProvider,
  BaseItemAnimator,
} from 'recyclerlistview';
import ListItem from './ListItem';
const {height, width} = Dimensions.get('window');

const ViewTypes = {
  HEADER: 0,
  LISTITEM: 1,
};

class ItemAnimator implements BaseItemAnimator {
  animateWillMount(atX, atY, itemIndex) {
    //This method is called before the componentWillMount of the list item in the rowrenderer
    //Fill in your logic.
    console.log('animateWillMount start', atX, atY, itemIndex);
    return undefined;
  }
  animateDidMount(atX, atY, itemRef, itemIndex) {
    //This method is called after the componentDidMount of the list item in the rowrenderer
    //Fill in your logic
    //No return
    console.log('animateDidMount start', atX, atY, itemRef, itemIndex);
  }
  animateWillUpdate(fromX, fromY, toX, toY, itemRef, itemIndex): void {
    //This method is called before the componentWillUpdate of the list item in the rowrenderer. If the list item is not re-rendered,
    //It is not triggered. Fill in your logic.
    // A simple example can be using a native layout animation shown below - Custom animations can be implemented as required.

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    //No return
    console.log(
      'animateWillUpdate start',
      fromX,
      fromY,
      toX,
      toY,
      itemRef,
      itemIndex,
    );
  }
  animateShift(fromX, fromY, toX, toY, itemRef, itemIndex): boolean {
    //This method is called if the the props have not changed, but the view has shifted by a certain amount along either x or y axes.
    //Note that, this method is not triggered if the props or size has changed and the animateWillUpdate will be triggered in that case.
    //Return value is used as the return value of shouldComponentUpdate, therefore will trigger a view re-render if true.

    console.log('animateShift start');
    return false;
  }
  animateWillUnmount(atX, atY, itemRef, itemIndex): void {
    //This method is called before the componentWillUnmount of the list item in the rowrenderer
    //No return
    console.log('animateWillUnmount start', atX, atY, itemRef, itemIndex);
  }
}

const getMockData = n => {
  let data = [];
  for (let i = 0; i < n; i++) {
    data.push({
      id: i.toString(),
      content: 'Press to toggle ',
    });
  }
  return data;
};

class List extends React.Component<any, any> {
  layoutProvider: LayoutProvider;
  itemAnimator: ItemAnimator;
  recyclerListViewRef: React.RefObject<unknown>;
  constructor(props) {
    super(props);
    let data = getMockData(50);

    //Create the data provider and provide method which takes in two rows of data and return if those two are different or not. This method
    //is very important for performance. Note that everytime the data changes, the component must be rendered therefore make dataprovider part
    //of the state.
    //The second parameter passed to the dataprovider is the stableID provider, a function which takes index as input and returns the stableId      //for that index. Make sure that the stableId is a string. In the current explanation we are returning the id associated with the data item
    //as the stableId.
    let dataProvider = new DataProvider(
      (r1, r2) => {
        return r1 !== r2;
      },
      index => {
        return data[index].id;
      },
    );

    //The layout provider must be provided with two methods. The first method is the get layout based on index which determines the layout type
    //based on the index. In the second method, the layout's estimated size i.e its height and width is specified on basis of the layout type.
    this.layoutProvider = new LayoutProvider(
      i => {
        if (i == 0) {
          return ViewTypes.HEADER;
        } else {
          return ViewTypes.LISTITEM;
        }
      },
      (type, dim) => {
        switch (type) {
          // 通过定义不同属性，可以实现不同的展示效果，里flatlist的headercomponet，可以通过定义HEADER类型实现
          case ViewTypes.HEADER:
            dim.width = width;
            dim.height = 100;
            break;
          case ViewTypes.LISTITEM:
            dim.width = width;
            dim.height = 50;
            break;
          default:
            dim.width = width;
            dim.height = 50;
        }
      },
    );
    this.itemAnimator = new ItemAnimator();
    this.recyclerListViewRef = React.createRef();
    this.state = {
      dataProvider: dataProvider.cloneWithRows(data),
      extendedState: {
        selected: {},
      },
    };
  }

  onPressItem = index => {
    console.log('Selected: ' + index);
    let extendedState = this.state.extendedState;
    if (index in extendedState.selected) {
      delete extendedState.selected[index];
    } else {
      extendedState.selected[index] = true;
    }
    this.setState(
      {
        extendedState: {...extendedState},
      },
      () => {
        console.log(this.state.extendedState.selected);
      },
    );
  };

  //This method returns the JSX element which should be rendered for each index based on its type. The first parameter specifies the type of      //layout for the current index.The second parameter item gives data of the current index from the dataprovided. The third parameter is the      //index itself. The fourth is the optional extendedstate parameter. Any local state which may need to be stored at the item level is better     //passed in the extendedstate prop. For example, the number of clicks on a list item is something ususally maintained in the item's local       //state. This is however discouraged as the items get reused when they have gone outside the viewport resulting in unexpected behaviors. As     //shown in this implementation, the extendedState prop can be used to store such data at the parent component level and pass it as a prop.      //The list items should also implement the shouldComponentUpdate to prevent unnecessary rendering. Make sure not to change the extendedState    //too many times as it can be expensive.
  renderItem = (type, item, index, extendedState) => {
    if (type === ViewTypes.HEADER) {
      return <Text style={styles.headerStyle}>Header</Text>;
    } else {
      let isSelected = index in extendedState.selected ? true : false;
      return (
        <ListItem
          item={item.content}
          index={index}
          selected={isSelected}
          onPressItem={this.onPressItem}
        />
      );
    }
  };

  renderFooter = () => {
    return <View><Text>123132</Text></View>
  }

  render() {
    let renderFooter =
      this.state.dataProvider.getSize() === 0 ? this.renderFooter : null;
    return (
      <View style={styles.rootContainer}>
        <View style={styles.flowRight}>
          <View style={styles.listContainer}>
            <RecyclerListView
              ref={this.recyclerListViewRef}
              rowRenderer={this.renderItem}
              dataProvider={this.state.dataProvider}
              layoutProvider={this.layoutProvider}
              extendedState={this.state.extendedState}
              itemAnimator={this.itemAnimator}
              renderFooter={renderFooter}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 8,
    flex: 1,
  },
  headerStyle: {
    fontSize: 60,
    padding: 10,
  },
  rootContainer: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
});

export default List;
