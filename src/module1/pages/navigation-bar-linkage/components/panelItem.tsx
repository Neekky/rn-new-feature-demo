import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PanelItem(props: any) {
  const { data, handlePress, curSeriesId, maxWidth } = props;

  const [itemHeight, setItemHeight] = useState(36); // 最小高度 36
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingHorizontal: 12,
        marginBottom: 8,
        borderRadius: 4
      }}
    >
      {data.map((ele, index) => (
        <TouchableOpacity onPress={() => handlePress(ele)} key={ele.id}>
          <View
            onLayout={event => {
              if (event.nativeEvent.layout.height > itemHeight) {
                setItemHeight(Math.round(event.nativeEvent.layout.height));
              }
            }}
            style={[
              styles.itemWrapper,
              { marginRight: index !== 2 ? 8 : 0 },
              { minHeight: itemHeight, width: (maxWidth - 40) / 3 },
              curSeriesId === ele.id && {
                backgroundColor: "#FFF4EE",
                borderColor: "#ff7c5d",
                borderWidth: 0.5,
                borderRadius: 4
              }
            ]}
          >
            <Text
              style={{
                textAlignVertical: "center",
                textAlign: "center",
                color: curSeriesId === ele.id ? "#FF542A" : "#333",
                fontSize: 14,
                lineHeight: 20
              }}
            >
              {ele.name}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 4
  }
});
