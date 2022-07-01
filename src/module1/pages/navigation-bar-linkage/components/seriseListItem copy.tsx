import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SeriseListItem(props: any) {
  const { handlePress, item, curSeriesId, index, getItemWidth } = props;
  return (
    <TouchableOpacity
      onPress={() => {
        handlePress(item);
      }}
    >
      <View
        onLayout={event => {
          getItemWidth({
            width: Math.round(event.nativeEvent.layout.width + 8),
            index,
            ...item
          });
        }}
        style={[
          styles.itemWrapper,
          curSeriesId === item.id && {
            backgroundColor: "#FFF4EE",
            borderColor: "#ff7c5d",
            borderWidth: 0.5
          }
        ]}
        key={item.seriesCode}
      >
        <Text style={{ color: item.id === curSeriesId ? "#FF542A" : "#333" }}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    height: 24,
    paddingHorizontal: 8,
    borderColor: "#e9e9e9",
    borderWidth: 0.5,
    borderRadius: 4,
    backgroundColor: "#F9F9F9",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center"
  }
});
