import React from "react";
import { StyleSheet, Text, View } from "react-native";
// import BalanceIcon from "../assets/svg/balanceIcon.svg";
import PercentIcon from "../assets/svg/PercentIcon.svg";
import { globalStyles } from "../theme/globalStyles";

const BalanceHistoryItem = ({ title, data, balance }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <View>
          <PercentIcon />
        </View>
        <View style={styles.titleMinBox}>
          <Text style={[globalStyles.MobT3, { color: "#000", marginBottom: 5 }]}>
            {title}
          </Text>
          <Text style={[globalStyles.MobT3, { fontSize: 14, }]}>
            {data}
          </Text>
        </View>
      </View>
      <View>
        <Text style={globalStyles.MobT1}>
          {balance} B
        </Text>
      </View>
    </View>
  );
};

export default BalanceHistoryItem;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  titleBox: {
    flexDirection: "row",

  },
  titleMinBox: {
    marginLeft: 16,
  },
});
