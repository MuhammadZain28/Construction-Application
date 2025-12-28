import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Platform,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useDataContext } from "./DataContext";
import { Wallets, Transactions, Records } from "../Class/App";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import Loading from "@/components/Loading";
import Header from "@/components/ui/Header";

export default function Wallet() {
  const {
    houses,
    wallet,
    transactions,
    record,
    materials,
    paints,
    loading,
    setIsRecordUpdated,
    setIsTransactionUpdated,
    setIsWalletUpdated,
  } = useDataContext();
  const [search, setSearch] = useState({
    transactions: "",
    record: "",
  });
  const [Form, setForm] = useState({
    id: "",
    name: "",
    cash: 0,
    date: new Date(),
    house: "",
    reason: "",
    walletid: "main",
  });
  const [formType, setFormType] = useState("");
  const [state, setState] = useState({
    date: false,
    mobile: true,
    reasons: false,
    update: false,
  });
  const [index, setIndex] = useState<number>(0);
  const [deleteType, setDeleteType] = useState<string>("");
  const [dropDownType, setDropDownType] = useState<string>("");
  const [transactionData, setTransactionData] = useState({
    in: 0,
    out: 0,
    lastIn: 0,
    lastOut: 0,
  });
  const router = useRouter();
  const transactionReasons = [
    "Other",

    "Sale",
    "Payment Received",
    "Refund Received",
    "Bonus",
    "Interest Income",
    "Investment Return",

    // Expense-Related
    "Purchase",
    "Bill Payment",
    "Rent",
    "Utilities",
    "Salary Payment",
    "Refund Issued",
    "Maintenance",
    "Transportation",
    "Marketing",
    "Subscription",

    // Transfer/Adjustment
    "Fund Transfer",
    "Cash Deposit",
    "Cash Withdrawal",
    "Internal Adjustment",
    "Currency Exchange",

    // Inventory/Material Usage
    "Stock Purchase",
    "Stock Sale",
    "Damaged Goods",
    "Returned Items",
    "Sample Distribution",

    // Custom/Other
    "Miscellaneous",
    "Donation",
    "Correction",
    "Penalty",
    "Commission",
    "Tax Payment",
  ];

  useEffect(() => {
    const monthlySum = async () => {
      const month = new Date().toISOString().slice(0, 7);
      const sum =
        (await Wallets.getMonthlySum(month, Form.walletid)) +
        (await Transactions.getMonthlySum(month, "In", Form.walletid));
      setTransactionData((prev) => ({ ...prev, in: sum }));
      const outSum = await Transactions.getMonthlySum(
        month,
        "Out",
        Form.walletid
      );
      setTransactionData((prev) => ({ ...prev, out: outSum }));
    };
    monthlySum();
  }, [Form.walletid, transactions]);

  useEffect(() => {
    const lastTransaction = async () => {
      const amount = transactions
        .filter((item) => item.wallet === Form.walletid && item.type === "In")
        .sort((a, b) => a.date.localeCompare(b.date));
      setTransactionData((prev) => ({
        ...prev,
        lastIn: amount[amount.length - 1]?.amount || 0,
      }));
      const outAmount = transactions
        .filter((item) => item.wallet === Form.walletid && item.type === "Out")
        .sort((a, b) => a.date.localeCompare(b.date));
      setTransactionData((prev) => ({
        ...prev,
        lastOut: outAmount[outAmount.length - 1]?.amount || 0,
      }));
    };
    lastTransaction();
  }, [Form.walletid, transactions]);

  useEffect(() => {
    setIndex(wallet.findIndex((item) => item.id === Form.walletid));
  }, [wallet, Form.walletid]);

  const onChange = (event: any, selectedDate: Date | undefined) => {
    setState((prev) => ({ ...prev, date: false }));
    if (selectedDate) {
      setForm((prev) => ({ ...prev, date: selectedDate }));
    }
  };

  useEffect(() => {
    const check = () => {
      if (Platform.OS === "web") {
        setState((prev) => ({ ...prev, mobile: false }));
      }
    };

    check();
  }, []);

  const handleHouseSelect = (code: string) => {
    setForm((prev) => ({ ...prev, home: code }));
    setDropDownType("");
  };

  const add = async () => {
    if (Form.house === "") {
      Alert.alert("Please select a house");
      return;
    }
    try {
      Wallets.save(
        Form.name,
        Form.house,
        Form.cash,
        Form.date.toISOString().substring(0, 10)
      );
      setIsWalletUpdated(true);
      setFormType("");
    } catch (error) {
      console.error("Error creating wallet:", error);
    }
  };
  const updateCash = async () => {
    try {
      const walletItem = wallet.find((item) => item.id === Form.walletid);
      if (!walletItem) {
        Alert.alert("Wallet not found");
        return;
      }
      const amount = walletItem.amount + Form.cash;
      Wallets.UpdateAmount(
        Form.walletid,
        amount,
        Form.date.toISOString().substring(0, 10),
        Form.cash
      );
      setIsWalletUpdated(true);
      setFormType("");
    } catch (error) {
      console.error("Error updating wallet:", error);
    }
  };

  const saveTransaction = async (type: "In" | "Out") => {
    if (Form.name === "" || Form.cash <= 0) {
      Alert.alert("Please fill all fields");
      return;
    }
    try {
      await Transactions.save(
        Form.walletid,
        Form.cash,
        type,
        Form.date.toISOString().substring(0, 10),
        Form.reason,
        Form.name
      );
      setIsTransactionUpdated(true);
      setFormType("");
      setState((prev) => ({ ...prev, update: false }));
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const saveRecord = async (type: "In" | "Out") => {
    if (Form.name === "" || Form.cash <= 0) {
      Alert.alert("Please fill all fields");
      return;
    }
    try {
      await Records.save(
        Form.name,
        Form.walletid,
        Form.cash,
        type,
        Form.date.toISOString().substring(0, 10),
        Form.reason
      );
      setIsRecordUpdated(true);
      setFormType("");
      setState((prev) => ({ ...prev, update: false }));
    } catch (error) {
      console.error("Error saving record:", error);
    }
  };

  const remove = async (type: string) => {
    try {
      if (type === "transaction") {
        Transactions.deleteTransaction(Form.id);
        setIsTransactionUpdated(true);
        setDropDownType("");
      } else if (type === "wallet") {
        Wallets.deleteWallet(Form.walletid);
        setForm((prev) => ({ ...prev, walletid: "main" }));
        setIsWalletUpdated(true);
        setDropDownType("");
      } else if (type === "record") {
        Records.deleteRecord(Form.id);
        setIsRecordUpdated(true);
        setDropDownType("");
      } else {
        Alert.alert("Invalid type");
        return;
      }
    } catch (error) {
      console.error("Error removing transaction:", error);
    }
  };
  const updateTransaction = async (type: "In" | "Out") => {
    if (Form.name === "" || Form.cash <= 0) {
      Alert.alert("Please fill all fields");
      return;
    }
    try {
      Transactions.update(
        Form.id,
        Form.walletid,
        Form.cash,
        type,
        Form.date.toISOString().substring(0, 10),
        Form.reason,
        Form.name
      );
      setIsTransactionUpdated(true);
      setFormType("");
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };
  const updateRecord = async (type: "In" | "Out") => {
    if (Form.name === "" || Form.cash <= 0) {
      Alert.alert("Please fill all fields");
      return;
    }
    try {
      Records.UpdateRecord(
        Form.id,
        Form.name,
        Form.walletid,
        Form.cash,
        type,
        Form.date.toISOString().substring(0, 10),
        Form.reason
      );
      setIsRecordUpdated(true);
      setFormType("");
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  if (loading) {
    return <Loading wallet={true} />;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={{ backgroundColor: "#dbdbdbff" }}>
          <Header icon="wallet" name="Wallets" />
          <View style={styles.main}>
            <View
              style={[
                styles.row,
                {
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 10,
                  width: "100%",
                },
              ]}
            >
              <LinearGradient
                colors={["#001c59ff", "#113175ff", "#00236f9b"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.5, 1]}
                style={[
                  { padding: 20, borderRadius: 10, margin: 0 },
                  styles.card,
                ]}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                  onPress={() => setDropDownType("Wallet")}
                >
                  <Ionicons name="wallet" size={28} color="#fff" />
                  <Text style={styles.head}>
                    {wallet[index]?.name || "Wallet"}
                  </Text>
                </TouchableOpacity>
                <View>
                  <Text style={styles.text}>
                    Rs.{" "}
                    {wallet[index]?.amount -
                      materials
                        .filter((item) => item.house === wallet[index]?.house)
                        .reduce((sum, item) => sum + item.price * item.no, 0) -
                      paints
                        .filter((item) => item.house === wallet[index]?.house)
                        .reduce((sum, item) => sum + item.price * item.no, 0) +
                      transactions
                        .filter((item) => item.wallet === wallet[index]?.id)
                        .reduce((sum, item) => sum + item.amount, 0) +
                      record
                        .filter((item) => item.wallet === wallet[index]?.id)
                        .reduce((sum, item) => sum + item.amount, 0)}
                  </Text>
                </View>
                <View style={styles.container}>
                  <View style={[styles.circle1]} />
                  <View style={[styles.circle2]} />
                </View>
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: 90,
                    right: 23,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    paddingInline: 12,
                    paddingBlock: 5,
                    borderRadius: 50,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                  onPress={() => setFormType("Cash")}
                >
                  <Ionicons name="add-circle" size={20} color="#fff" />
                  <Text
                    style={{ color: "rgb(255,255,255)", fontWeight: "700" }}
                  >
                    Cash In
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 20,
                  }}
                >
                  <View style={{ flex: 1, alignItems: "center", gap: 20 }}>
                    <Text
                      style={{
                        textAlign: "center",
                        color: "rgb(255, 255, 255)",
                        fontWeight: "700",
                      }}
                    >
                      Monthly In
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Text style={{ color: "rgb(255, 255, 255)" }}>
                        Rs. {transactionData.in}
                      </Text>
                      <View
                        style={{
                          backgroundColor: "rgba(10, 255, 10, 0.52)",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          paddingInline: 5,
                          borderRadius: 10,
                        }}
                      >
                        <Ionicons
                          name="arrow-up"
                          size={12}
                          color={"rgb(255, 255,255)"}
                        />
                        <Text
                          style={{ color: "rgb(255,255,255)", fontSize: 12 }}
                        >
                          {" "}
                          {transactionData.lastIn}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ flex: 1, alignItems: "center", gap: 20 }}>
                    <Text
                      style={{
                        textAlign: "center",
                        color: "rgb(255, 255, 255)",
                        fontWeight: "700",
                      }}
                    >
                      Monthly Out
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Text style={{ color: "rgb(255, 255, 255)" }}>
                        Rs. {transactionData.out}
                      </Text>
                      <View
                        style={{
                          backgroundColor: "rgba(255, 0, 0, 0.6)",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          paddingInline: 5,
                          borderRadius: 10,
                        }}
                      >
                        <Ionicons
                          name="arrow-down"
                          size={12}
                          color={"rgb(255, 255,255)"}
                        />
                        <Text
                          style={{ color: "rgb(255,255,255)", fontSize: 12 }}
                        >
                          {" "}
                          {transactionData.lastOut}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </LinearGradient>
              <TouchableOpacity
                style={[
                  {
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
                onPress={() => setFormType("Card")}
              >
                <Ionicons
                  name="add"
                  size={36}
                  style={{
                    padding: 20,
                    backgroundColor: "rgba(255, 255, 255, 0.75)",
                    borderRadius: 50,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.body}>
              <View style={styles.row}>
                <Text style={styles.icon}>Transactions</Text>
                <TouchableOpacity
                  style={[
                    styles.row,
                    {
                      gap: 10,
                      paddingBlock: 10,
                      backgroundColor: "rgba(0, 35, 123, 1)",
                      borderRadius: 50,
                    },
                  ]}
                  onPress={() => {
                    setFormType("Transaction");
                    setState((prev) => ({ ...prev, update: true }));
                  }}
                >
                  <Ionicons
                    name="receipt"
                    color={"rgb(255,255,255)"}
                    size={20}
                  ></Ionicons>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "900",
                      color: "rgb(255,255,255)",
                    }}
                  >
                    Transaction
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.searchBar}>
                <TextInput
                  placeholder="Search...."
                  style={styles.searchInput}
                  value={search.transactions}
                  onChangeText={(text) =>
                    setSearch((prev) => ({ ...prev, transactions: text }))
                  }
                />
                {search.transactions.length > 0 && (
                  <TouchableOpacity
                    onPress={() =>
                      setSearch((prev) => ({ ...prev, transactions: "" }))
                    }
                    style={{ position: "absolute", right: 10 }}
                  >
                    <Ionicons
                      name="close"
                      size={18}
                      color={"rgba(255, 174, 0, 1)"}
                    />
                  </TouchableOpacity>
                )}
                {search.transactions.length > 0 && (
                  <FlatList
                    data={transactions.filter((item) =>
                      item.name
                        .toLowerCase()
                        .includes(search.transactions.toLowerCase())
                    )}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setForm((prev) => ({
                            ...prev,
                            name: item.name,
                            walletid: item.wallet,
                            cash: item.amount,
                            date: new Date(item.date),
                            reason: item.reason || "Other",
                            type: "Transaction",
                            id: item.id,
                          }));
                          setFormType("Transaction");
                        }}
                      >
                        <Text style={{ padding: 10, fontSize: 16 }}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    )}
                    style={{
                      position: "absolute",
                      width: 350,
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      borderRadius: 10,
                      marginTop: 50,
                      zIndex: 100,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  />
                )}
              </View>
              <View style={{ gap: 10, marginTop: 10 }}>
                {transactions
                  .filter((t) => t.wallet === Form.walletid)
                  .map((item, index) =>
                    item.type === "In" ? (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.row,
                          {
                            backgroundColor: "rgba(4, 159, 9, 0.1)",
                            padding: 10,
                            borderRadius: 10,
                            marginInline: 10,
                          },
                        ]}
                        onLongPress={() => {
                          setDropDownType("Delete");
                          setForm((prev) => ({ ...prev, id: item.id }));
                          setDeleteType("transaction");
                        }}
                        onPress={() => {
                          setForm((prev) => ({
                            ...prev,
                            name: item.name,
                            walletid: item.wallet,
                            cash: item.amount,
                            date: new Date(item.date),
                            reason: item.reason || "Other",
                            type: "Transaction",
                            id: item.id,
                          }));
                          setFormType("Transaction");
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            color: "rgba(4, 159, 9, 1)",
                            fontWeight: 700,
                          }}
                        >
                          {item.name}
                        </Text>
                        <View style={[styles.row, { gap: 10 }]}>
                          <Text
                            style={{
                              color: "rgba(4, 159, 9, 1)",
                              fontSize: 16,
                              fontWeight: 700,
                            }}
                          >
                            Rs. {item.amount}
                          </Text>
                          <Ionicons
                            name="arrow-up"
                            size={20}
                            color={"rgba(4, 159, 9, 1)"}
                          />
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.row,
                          {
                            backgroundColor: "rgba(159, 4, 4, 0.1)",
                            padding: 10,
                            borderRadius: 10,
                            marginInline: 10,
                          },
                        ]}
                        onLongPress={() => {
                          setDropDownType("Delete");
                          setForm((prev) => ({ ...prev, id: item.id }));
                          setDeleteType("transaction");
                        }}
                        onPress={() => {
                          setForm((prev) => ({
                            ...prev,
                            name: item.name,
                            walletid: item.wallet,
                            cash: item.amount,
                            date: new Date(item.date),
                            reason: item.reason || "Other",
                            type: "Transaction",
                            id: item.id,
                          }));
                          setFormType("Transaction");
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            color: "rgba(211, 0, 0, 1)",
                            fontWeight: 700,
                          }}
                        >
                          {item.name}
                        </Text>
                        <View style={[styles.row, { gap: 10 }]}>
                          <Text
                            style={{
                              color: "rgba(211, 0, 0, 1)",
                              fontSize: 16,
                              fontWeight: 700,
                            }}
                          >
                            Rs. {-item.amount}
                          </Text>
                          <Ionicons
                            name="arrow-down"
                            size={20}
                            color={"rgba(211, 0, 0, 1)"}
                          />
                        </View>
                      </TouchableOpacity>
                    )
                  )}
              </View>
            </View>

            <View style={styles.body}>
              <View style={styles.row}>
                <Text style={styles.icon}>Records</Text>
                <TouchableOpacity
                  style={[
                    styles.row,
                    {
                      gap: 10,
                      paddingBlock: 10,
                      backgroundColor: "rgba(0, 35, 123, 1)",
                      borderRadius: 50,
                    },
                  ]}
                  onPress={() => {
                    setFormType("Record");
                    setState((prev) => ({ ...prev, update: true }));
                  }}
                >
                  <Ionicons
                    name="book"
                    color={"rgb(255,255,255)"}
                    size={20}
                  ></Ionicons>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "900",
                      color: "rgb(255,255,255)",
                    }}
                  >
                    Record
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.searchBar}>
                <TextInput
                  placeholder="Search...."
                  style={styles.searchInput}
                  value={search.record}
                  onChangeText={(text) =>
                    setSearch((prev) => ({ ...prev, record: text }))
                  }
                />
                {search.record.length > 0 && (
                  <TouchableOpacity
                    onPress={() =>
                      setSearch((prev) => ({ ...prev, record: "" }))
                    }
                    style={{ position: "absolute", right: 10 }}
                  >
                    <Ionicons
                      name="close"
                      size={18}
                      color={"rgba(255, 174, 0, 1)"}
                    />
                  </TouchableOpacity>
                )}
                {search.record.length > 0 && (
                  <FlatList
                    data={record.filter((item) =>
                      item.name
                        .toLowerCase()
                        .includes(search.record.toLowerCase())
                    )}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setForm((prev) => ({
                            ...prev,
                            name: item.name,
                            walletid: item.wallet,
                            cash: item.amount,
                            date: new Date(item.date),
                            reason: item.reason || "Other",
                            type: "Record",
                            id: item.id,
                          }));
                          setFormType("Record");
                        }}
                      >
                        <Text style={{ padding: 10, fontSize: 16 }}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    )}
                    style={{
                      position: "absolute",
                      width: 350,
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      borderRadius: 10,
                      top: 50,
                      zIndex: 100,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  />
                )}
              </View>
              <View style={{ gap: 10, marginTop: 10 }}>
                {record
                  .filter((r) => r.wallet === Form.walletid)
                  .map((item, index) =>
                    item.amount >= 0 ? (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.row,
                          {
                            backgroundColor: "rgba(4, 159, 9, 0.1)",
                            padding: 10,
                            marginInline: 10,
                            borderRadius: 10,
                          },
                        ]}
                        onLongPress={() => {
                          setDropDownType("Delete");
                          setForm((prev) => ({ ...prev, id: item.id }));
                          setDeleteType("record");
                        }}
                        onPress={() => {
                          router.push({
                            pathname: "/Record",
                            params: {
                              Recordid: item.id,
                              name: item.name,
                              Total: item.amount,
                              wallet: wallet.find((w) => w.id === item.wallet)
                                ?.name,
                              house: wallet.find((w) => w.id === item.wallet)
                                ?.house,
                            },
                          });
                        }}
                      >
                        <View style={[styles.row, { gap: 10 }]}>
                          <FontAwesome6
                            name="user-circle"
                            size={30}
                            color={"rgba(4, 159, 9, 1)"}
                          />
                          <Text
                            style={{
                              fontSize: 16,
                              color: "rgba(4, 159, 9, 1)",
                              fontWeight: 700,
                            }}
                          >
                            {item.name}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: "rgba(4, 159, 9, 1)",
                            fontSize: 16,
                            fontWeight: 700,
                          }}
                        >
                          Rs. {item.amount}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.row,
                          {
                            backgroundColor: "rgba(159, 4, 4, 0.1)",
                            padding: 10,
                            marginInline: 10,
                            borderRadius: 10,
                          },
                        ]}
                        onLongPress={() => {
                          setDropDownType("Delete");
                          setForm((prev) => ({ ...prev, id: item.id }));
                          setDeleteType("record");
                        }}
                        onPress={() => {
                          router.push({
                            pathname: "/Record",
                            params: {
                              Recordid: item.id,
                              name: item.name,
                              Total: item.amount,
                              wallet: wallet.find((w) => w.id === item.wallet)
                                ?.name,
                              house: wallet.find((w) => w.id === item.wallet)
                                ?.house,
                            },
                          });
                        }}
                      >
                        <View style={[styles.row, { gap: 10 }]}>
                          <FontAwesome6
                            name="user-circle"
                            size={30}
                            color={"rgba(211, 0, 0, 1)"}
                          />
                          <Text
                            style={{
                              fontSize: 16,
                              color: "rgba(211, 0, 0, 1)",
                              fontWeight: 700,
                            }}
                          >
                            {item.name}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: "rgba(211, 0, 0, 1)",
                            fontSize: 16,
                            fontWeight: 700,
                          }}
                        >
                          Rs. {item.amount}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
              </View>
            </View>
          </View>

          <Modal
            visible={formType !== ""}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {
              setFormType("");
            }}
          >
            <View style={styles.back}>
              {
                {
                  Cash: (
                    <View style={styles.form}>
                      <Text
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 24,
                          marginBottom: 40,
                        }}
                      >
                        CASH IN
                      </Text>
                      <Text
                        style={[
                          {
                            color: "rgb(0,0,0)",
                            fontSize: 18,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        Cash
                      </Text>
                      <TextInput
                        style={[styles.input, { outline: "none" }]}
                        onChangeText={(text) =>
                          setForm((prev) => ({
                            ...prev,
                            cash: parseFloat(text),
                          }))
                        }
                        value={Form.cash.toString()}
                        keyboardType="numeric"
                      />
                      <Text
                        style={[
                          {
                            color: "rgb(0,0,0)",
                            fontSize: 18,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        Date
                      </Text>
                      {!state.mobile ? (
                        <input
                          type="date"
                          value={
                            Form.date instanceof Date &&
                            !isNaN(Form.date.getTime())
                              ? Form.date.toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              date: new Date(e.target.value),
                            }))
                          }
                          style={{
                            borderBottomColor: "#000",
                            height: 40,
                            borderBottomWidth: 1,
                            borderInlineWidth: 0,
                            borderTopWidth: 0,
                            marginBottom: 20,
                            fontFamily: "Arial",
                          }}
                        />
                      ) : (
                        <View>
                          <TouchableOpacity
                            style={{
                              backgroundColor: "rgb(255, 255, 255)",
                              borderBottomWidth: 1,
                              borderColor: "#000",
                              paddingInline: 15,
                              paddingBlock: 5,
                              marginBottom: 10,
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                            onPress={() =>
                              setState((prev) => ({ ...prev, date: true }))
                            }
                          >
                            <Text style={{ color: "rgba(0, 0, 0, 1)" }}>
                              {Form.date.toLocaleDateString()}
                            </Text>
                            <Ionicons
                              name="chevron-down"
                              style={{ fontSize: 20 }}
                            />
                          </TouchableOpacity>
                          {state.date && (
                            <DateTimePicker
                              value={new Date(Form.date)}
                              mode="date"
                              display="default"
                              onChange={(event, selectedDate) =>
                                onChange(event, selectedDate)
                              }
                            />
                          )}
                        </View>
                      )}
                      <TouchableOpacity
                        onPress={() => {
                          setFormType("");
                          updateCash();
                        }}
                        style={{
                          width: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "rgba(255, 191, 0, 1)",
                          borderRadius: 20,
                          padding: 10,
                          marginBlock: 20,
                        }}
                      >
                        <Text style={styles.text}>Confirm</Text>
                      </TouchableOpacity>
                    </View>
                  ),
                  Card: (
                    <View style={styles.form}>
                      <Text
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 24,
                          marginBottom: 30,
                        }}
                      >
                        WALLET
                      </Text>
                      <Text
                        style={[
                          {
                            color: "rgb(0,0,0)",
                            fontSize: 18,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        Name
                      </Text>
                      <TextInput
                        style={[styles.input, { outline: "none" }]}
                        value={Form.name}
                        onChangeText={(name) =>
                          setForm((prev) => ({ ...prev, name }))
                        }
                      />
                      <Text
                        style={[
                          {
                            color: "rgb(0,0,0)",
                            fontSize: 18,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        Cash In
                      </Text>
                      <TextInput
                        style={[styles.input, { outline: "none" }]}
                        value={Form.cash.toString()}
                        onChangeText={(cash) =>
                          setForm((prev) => ({ ...prev, cash: parseInt(cash) }))
                        }
                        keyboardType="numeric"
                      />
                      <Text
                        style={[
                          {
                            color: "rgb(0,0,0)",
                            fontSize: 18,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        Date
                      </Text>
                      {!state.mobile ? (
                        <input
                          type="date"
                          value={
                            Form.date instanceof Date &&
                            !isNaN(Form.date.getTime())
                              ? Form.date.toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              date: new Date(e.target.value),
                            }))
                          }
                          style={{
                            borderBottomColor: "#000",
                            height: 40,
                            borderBottomWidth: 1,
                            borderInlineWidth: 0,
                            borderTopWidth: 0,
                            marginBottom: 20,
                            fontFamily: "Arial",
                          }}
                        />
                      ) : (
                        <View>
                          <TouchableOpacity
                            style={{
                              backgroundColor: "rgb(255, 255, 255)",
                              borderBottomWidth: 1,
                              borderColor: "#000",
                              paddingInline: 15,
                              paddingBlock: 5,
                              marginBottom: 10,
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                            onPress={() =>
                              setState((prev) => ({ ...prev, date: true }))
                            }
                          >
                            <Text style={{ color: "rgba(0, 0, 0, 1)" }}>
                              {Form.date.toLocaleDateString()}
                            </Text>
                            <Ionicons
                              name="chevron-down"
                              style={{ fontSize: 20 }}
                            />
                          </TouchableOpacity>
                          {state.date && (
                            <DateTimePicker
                              value={new Date(Form.date)}
                              mode="date"
                              display="default"
                              onChange={(event, selectedDate) =>
                                onChange(event, selectedDate)
                              }
                            />
                          )}
                        </View>
                      )}
                      <Text
                        style={[
                          {
                            color: "rgb(0,0,0)",
                            fontSize: 18,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        House
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.input,
                          {
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          },
                        ]}
                        onPress={() => setDropDownType("House")}
                      >
                        <Text style={{ color: "rgb(0,0,0)" }}>
                          {houses.find((h) => h.code === Form.house)?.name ||
                            "All Houses"}
                        </Text>
                        <Ionicons
                          name="chevron-down"
                          size={20}
                          color={"rgb(0,0,0)"}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => add()}
                        style={{
                          width: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "rgba(255, 187, 0, 1)",
                          borderRadius: 20,
                          padding: 10,
                          marginTop: 20,
                        }}
                      >
                        <Text style={styles.text}>Confirm</Text>
                      </TouchableOpacity>
                    </View>
                  ),
                  Record: (
                    <View style={styles.form}>
                      <Text
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 24,
                          marginBottom: 30,
                        }}
                      >
                        Records
                      </Text>
                      <Text
                        style={[
                          {
                            color: "rgb(0,0,0)",
                            fontSize: 18,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        Name
                      </Text>
                      <TextInput
                        style={[styles.input, { outline: "none" }]}
                        value={Form.name}
                        onChangeText={(name) =>
                          setForm((prev) => ({ ...prev, name }))
                        }
                      />
                      <Text
                        style={[
                          {
                            color: "rgb(0,0,0)",
                            fontSize: 18,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        Cash
                      </Text>
                      <TextInput
                        style={[styles.input, { outline: "none" }]}
                        value={Form.cash.toString()}
                        onChangeText={(cash) =>
                          setForm((prev) => ({ ...prev, cash: parseInt(cash) }))
                        }
                        keyboardType="numeric"
                      />
                      <Text
                        style={[
                          {
                            color: "rgb(0,0,0)",
                            fontSize: 18,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        Reason
                      </Text>
                      <View
                        style={[
                          styles.input,
                          {
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            zIndex: 10,
                          },
                        ]}
                      >
                        <TextInput
                          style={[
                            {
                              color: "rgb(0,0,0)",
                              width: "100%",
                              outline: "none",
                            },
                          ]}
                          value={Form.reason}
                          onChangeText={(e) => {
                            setForm((prev) => ({ ...prev, reason: e }));
                            setState((prev) => ({ ...prev, reasons: true }));
                          }}
                        />
                        <TouchableOpacity>
                          <Ionicons
                            name="chevron-down"
                            size={20}
                            color={"rgb(0,0,0)"}
                          />
                        </TouchableOpacity>
                        {Form.reason.length > 0 && state.reasons && (
                          <FlatList
                            data={transactionReasons.filter((t) =>
                              t
                                .toLowerCase()
                                .includes(Form.reason.toLowerCase())
                            )}
                            keyExtractor={(item) => item}
                            style={{
                              position: "absolute",
                              width: "100%",
                              backgroundColor: "rgba(255, 255, 255, 1)",
                              borderRadius: 10,
                              top: 50,
                              left: 0,
                              zIndex: 100,
                              shadowColor: "#000",
                              height: 250,
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.1,
                              shadowRadius: 4,
                              elevation: 2,
                            }}
                            scrollEnabled={true}
                            renderScrollComponent={(props) => (
                              <ScrollView {...props} />
                            )}
                            renderItem={({ item }) => (
                              <TouchableOpacity
                                onPress={() => {
                                  setForm((prev) => ({
                                    ...prev,
                                    reason: item,
                                  }));
                                  setState((prev) => ({
                                    ...prev,
                                    reasons: false,
                                  }));
                                }}
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingVertical: 10,
                                  paddingHorizontal: 15,
                                  borderBottomColor: "#ddd",
                                  borderBottomWidth: 1,
                                }}
                              >
                                {item === Form.reason ? (
                                  <MaterialCommunityIcons
                                    name="circle-slice-8"
                                    style={{
                                      fontSize: 20,
                                      color: "rgb(7, 180, 48)",
                                      paddingRight: 10,
                                    }}
                                  />
                                ) : (
                                  <MaterialCommunityIcons
                                    name="circle-outline"
                                    style={{
                                      fontSize: 20,
                                      color: "rgb(7, 180, 48)",
                                      paddingRight: 10,
                                    }}
                                  />
                                )}
                                <Text style={{ fontSize: 18 }}>{item}</Text>
                              </TouchableOpacity>
                            )}
                          />
                        )}
                      </View>
                      <Text
                        style={[
                          {
                            color: "rgb(0,0,0)",
                            fontSize: 18,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        Date
                      </Text>
                      {!state.mobile ? (
                        <input
                          type="date"
                          value={
                            Form.date instanceof Date &&
                            !isNaN(Form.date.getTime())
                              ? Form.date.toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              date: new Date(e.target.value),
                            }))
                          }
                          style={{
                            borderBottomColor: "#000",
                            height: 40,
                            borderBottomWidth: 1,
                            borderInlineWidth: 0,
                            borderTopWidth: 0,
                            marginBottom: 20,
                            fontFamily: "Arial",
                          }}
                        />
                      ) : (
                        <View>
                          <TouchableOpacity
                            style={{
                              backgroundColor: "rgb(255, 255, 255)",
                              borderBottomWidth: 1,
                              borderColor: "#000",
                              paddingInline: 15,
                              paddingBlock: 5,
                              marginBottom: 10,
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                            onPress={() =>
                              setState((prev) => ({ ...prev, date: true }))
                            }
                          >
                            <Text style={{ color: "rgba(0, 0, 0, 1)" }}>
                              {Form.date.toLocaleDateString()}
                            </Text>
                            <Ionicons
                              name="chevron-down"
                              style={{ fontSize: 20 }}
                            />
                          </TouchableOpacity>
                          {state.date && (
                            <DateTimePicker
                              value={new Date(Form.date)}
                              mode="date"
                              display="default"
                              onChange={(event, selectedDate) =>
                                onChange(event, selectedDate)
                              }
                            />
                          )}
                        </View>
                      )}
                      {state.update ? (
                        <View
                          style={[
                            styles.row,
                            { justifyContent: "space-around", marginTop: 20 },
                          ]}
                        >
                          <TouchableOpacity
                            onPress={() => saveRecord("Out")}
                            style={{
                              width: "40%",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "rgba(255, 0, 0, 1)",
                              borderRadius: 20,
                              paddingInline: 10,
                              paddingBlock: 5,
                            }}
                          >
                            <Text style={[styles.text, { marginInline: 0 }]}>
                              Out
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => saveRecord("In")}
                            style={{
                              width: "40%",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "rgba(26, 173, 0, 1)",
                              borderRadius: 20,
                              paddingInline: 10,
                              paddingBlock: 5,
                            }}
                          >
                            <Text style={[styles.text, { marginInline: 0 }]}>
                              In
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View
                          style={[
                            styles.row,
                            { justifyContent: "space-around", marginTop: 20 },
                          ]}
                        >
                          <TouchableOpacity
                            onPress={() => updateRecord("Out")}
                            style={{
                              width: "40%",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "rgba(255, 0, 0, 1)",
                              borderRadius: 20,
                              paddingBlock: 5,
                            }}
                          >
                            <Text style={[styles.text, { marginInline: 0 }]}>
                              Out
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => updateRecord("In")}
                            style={{
                              width: "40%",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "rgba(26, 173, 0, 1)",
                              borderRadius: 20,
                              paddingBlock: 5,
                            }}
                          >
                            <Text style={[styles.text, { marginInline: 0 }]}>
                              In
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ),
                  Transaction: (
                    <View style={styles.form}>
                      <Text
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 24,
                          marginBottom: 30,
                        }}
                      >
                        Transaction
                      </Text>
                      <Text
                        style={[
                          {
                            color: "rgb(0,0,0)",
                            fontSize: 18,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        Name
                      </Text>
                      <TextInput
                        style={[styles.input, { outline: "none" }]}
                        value={Form.name}
                        onChangeText={(text) =>
                          setForm((prev) => ({ ...prev, name: text }))
                        }
                      />
                      <Text
                        style={[
                          {
                            color: "rgb(0,0,0)",
                            fontSize: 18,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        Cash
                      </Text>
                      <TextInput
                        style={[styles.input, { outline: "none" }]}
                        value={Form.cash.toString()}
                        onChangeText={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            cash: parseFloat(e) || 0,
                          }))
                        }
                      />
                      <Text
                        style={[
                          {
                            color: "rgb(0,0,0)",
                            fontSize: 18,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        Reason
                      </Text>
                      <View
                        style={[
                          styles.input,
                          {
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            zIndex: 10,
                          },
                        ]}
                      >
                        <TextInput
                          style={[
                            {
                              color: "rgb(0,0,0)",
                              width: "100%",
                              outline: "none",
                            },
                          ]}
                          value={Form.reason}
                          onChangeText={(e) => {
                            setForm((prev) => ({ ...prev, reason: e }));
                            setState((prev) => ({ ...prev, reasons: true }));
                          }}
                        />
                        <TouchableOpacity>
                          <Ionicons
                            name="chevron-down"
                            size={20}
                            color={"rgb(0,0,0)"}
                          />
                        </TouchableOpacity>
                        {Form.reason.length > 0 && state.reasons && (
                          <FlatList
                            data={transactionReasons.filter((t) =>
                              t
                                .toLowerCase()
                                .includes(Form.reason.toLowerCase())
                            )}
                            keyExtractor={(item) => item}
                            style={{
                              position: "absolute",
                              width: "100%",
                              backgroundColor: "rgba(255, 255, 255, 1)",
                              borderRadius: 10,
                              top: 50,
                              left: 0,
                              zIndex: 100,
                              shadowColor: "#000",
                              height: 250,
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.1,
                              shadowRadius: 4,
                              elevation: 2,
                            }}
                            scrollEnabled={true}
                            renderScrollComponent={(props) => (
                              <ScrollView {...props} />
                            )}
                            renderItem={({ item }) => (
                              <TouchableOpacity
                                onPress={() => {
                                  setForm((prev) => ({
                                    ...prev,
                                    reason: item,
                                  }));
                                  setState((prev) => ({
                                    ...prev,
                                    reasons: false,
                                  }));
                                }}
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingVertical: 10,
                                  paddingHorizontal: 15,
                                  borderBottomColor: "#ddd",
                                  borderBottomWidth: 1,
                                }}
                              >
                                {item === Form.reason ? (
                                  <MaterialCommunityIcons
                                    name="circle-slice-8"
                                    style={{
                                      fontSize: 20,
                                      color: "rgb(7, 180, 48)",
                                      paddingRight: 10,
                                    }}
                                  />
                                ) : (
                                  <MaterialCommunityIcons
                                    name="circle-outline"
                                    style={{
                                      fontSize: 20,
                                      color: "rgb(7, 180, 48)",
                                      paddingRight: 10,
                                    }}
                                  />
                                )}
                                <Text style={{ fontSize: 18 }}>{item}</Text>
                              </TouchableOpacity>
                            )}
                          />
                        )}
                      </View>
                      <Text
                        style={[
                          {
                            color: "rgb(0,0,0)",
                            fontSize: 18,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        Date
                      </Text>
                      {!state.mobile ? (
                        <input
                          type="date"
                          value={
                            Form.date instanceof Date &&
                            !isNaN(Form.date.getTime())
                              ? Form.date.toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              date: new Date(e.target.value),
                            }))
                          }
                          style={{
                            borderBottomColor: "#000",
                            height: 40,
                            borderBottomWidth: 1,
                            borderInlineWidth: 0,
                            borderTopWidth: 0,
                            marginBottom: 20,
                            fontFamily: "Arial",
                          }}
                        />
                      ) : (
                        <View>
                          <TouchableOpacity
                            style={{
                              backgroundColor: "rgb(255, 255, 255)",
                              borderBottomWidth: 1,
                              borderColor: "#000",
                              paddingInline: 15,
                              paddingBlock: 5,
                              marginBottom: 10,
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                            onPress={() =>
                              setState((prev) => ({ ...prev, date: true }))
                            }
                          >
                            <Text style={{ color: "rgba(0, 0, 0, 1)" }}>
                              {Form.date.toLocaleDateString()}
                            </Text>
                            <Ionicons
                              name="chevron-down"
                              style={{ fontSize: 20 }}
                            />
                          </TouchableOpacity>
                          {state.date && (
                            <DateTimePicker
                              value={new Date(Form.date)}
                              mode="date"
                              display="default"
                              onChange={(event, selectedDate) =>
                                onChange(event, selectedDate)
                              }
                            />
                          )}
                        </View>
                      )}
                      {state.update ? (
                        <View
                          style={[
                            styles.row,
                            { justifyContent: "space-around", marginTop: 20 },
                          ]}
                        >
                          <TouchableOpacity
                            onPress={() => saveTransaction("Out")}
                            style={{
                              width: "40%",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "rgba(255, 0, 0, 1)",
                              borderRadius: 20,
                              padding: 5,
                            }}
                          >
                            <Text style={[styles.text, { marginInline: 0 }]}>
                              Out
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => saveTransaction("In")}
                            style={{
                              width: "40%",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "rgba(54, 163, 0, 1)",
                              borderRadius: 20,
                              padding: 5,
                            }}
                          >
                            <Text style={[styles.text, { marginInline: 0 }]}>
                              In
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View
                          style={[
                            styles.row,
                            { justifyContent: "space-around", marginTop: 20 },
                          ]}
                        >
                          <TouchableOpacity
                            onPress={() => updateTransaction("Out")}
                            style={{
                              width: "40%",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "rgba(255, 0, 0, 1)",
                              borderRadius: 20,
                              padding: 5,
                            }}
                          >
                            <Text style={styles.text}>Out</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => updateTransaction("In")}
                            style={{
                              width: "40%",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "rgba(54, 163, 0, 1)",
                              borderRadius: 20,
                              padding: 5,
                            }}
                          >
                            <Text style={styles.text}>In</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ),
                }[formType]
              }

              <TouchableOpacity
                onPress={() => {
                  setFormType("");
                }}
                style={{
                  borderRadius: 50,
                  backgroundColor: "rgba(48, 47, 47, 0.51)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="close"
                  style={{
                    color: "#ffffffff",
                    textAlign: "center",
                    fontSize: 32,
                    padding: 10,
                  }}
                />
              </TouchableOpacity>
            </View>
          </Modal>

          <Modal
            visible={dropDownType !== ""}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setDropDownType("")}
          >
            {
              {
                Wallet: (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      flex: 1,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    <View style={styles.dropDown}>
                      <TouchableOpacity
                        onPress={() => {
                          setForm((prev) => ({ ...prev, walletid: "main" }));
                          setIndex(wallet.findIndex((w) => w.id === Form.id));
                          setDropDownType("");
                        }}
                        style={{
                          padding: 10,
                          borderBottomColor: "#ddd",
                          borderBottomWidth: 1,
                        }}
                      >
                        <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                          Wallets
                        </Text>
                      </TouchableOpacity>
                      <FlatList
                        data={wallet}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => {
                              setForm((prev) => ({
                                ...prev,
                                walletid: item.id,
                              }));
                              setIndex(
                                wallet.findIndex((w) => w.id === item.id)
                              );
                              setDropDownType("");
                            }}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              paddingVertical: 10,
                              paddingHorizontal: 15,
                              borderBottomColor: "#ddd",
                              borderBottomWidth: 1,
                            }}
                          >
                            {item.id === Form.walletid ? (
                              <MaterialCommunityIcons
                                name="circle-slice-8"
                                style={{
                                  fontSize: 20,
                                  color: "rgb(7, 180, 48)",
                                  paddingRight: 10,
                                }}
                              />
                            ) : (
                              <MaterialCommunityIcons
                                name="circle-outline"
                                style={{
                                  fontSize: 20,
                                  color: "rgb(7, 180, 48)",
                                  paddingRight: 10,
                                }}
                              />
                            )}
                            <Text style={{ fontSize: 18 }}>{item.name}</Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </View>
                ),
                Delete: (
                  <View
                    style={{
                      flex: 1,
                      gap: 10,
                      backgroundColor: "rgba(97, 97, 97, 0.5)",
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        backgroundColor: "#fff",
                        padding: 20,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        bottom: 0,
                        gap: 20,
                        position: "absolute",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 10,
                          paddingBottom: 10,
                          flex: 1,
                        }}
                      >
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                          Delete Items
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={{ position: "absolute", top: 5, right: 5 }}
                        onPress={() => setDropDownType("")}
                      >
                        <MaterialIcons
                          name="cancel"
                          style={{ color: "rgba(54, 57, 55, 1)", fontSize: 24 }}
                        />
                      </TouchableOpacity>
                      <View
                        style={{
                          width: "100%",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => setDropDownType("")}
                            style={{
                              flexDirection: "row",
                              gap: 5,
                              justifyContent: "center",
                              alignItems: "center",
                              paddingBlock: 5,
                              paddingInline: 15,
                              borderRadius: 15,
                              backgroundColor: "rgba(60, 94, 245, 1)",
                            }}
                          >
                            <MaterialIcons
                              name="cancel"
                              style={{ color: "white", fontSize: 24 }}
                            />
                            <Text
                              style={{ color: "white", fontWeight: "bold" }}
                            >
                              Cancel
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              setDropDownType("");
                              remove(deleteType);
                            }}
                            style={{
                              flexDirection: "row",
                              gap: 5,
                              justifyContent: "center",
                              alignItems: "center",
                              paddingBlock: 5,
                              paddingInline: 15,
                              borderRadius: 15,
                              backgroundColor: "rgb(255, 50, 10)",
                            }}
                          >
                            <MaterialIcons
                              name="delete"
                              style={{ color: "white", fontSize: 24 }}
                            />
                            <Text
                              style={{ color: "white", fontWeight: "bold" }}
                            >
                              Delete
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ),
                House: (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      flex: 1,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    <View style={styles.dropDown}>
                      <TouchableOpacity
                        onPress={() => handleHouseSelect("All Houses")}
                      >
                        <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                          Home
                        </Text>
                      </TouchableOpacity>

                      <FlatList
                        data={houses}
                        keyExtractor={(item) => item.name}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => handleHouseSelect(item.code)}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              paddingVertical: 10,
                              paddingHorizontal: 15,
                              borderBottomColor: "#ddd",
                              borderBottomWidth: 1,
                            }}
                          >
                            {item.code === Form.house ? (
                              <MaterialCommunityIcons
                                name="circle-slice-8"
                                style={{
                                  fontSize: 20,
                                  color: "rgb(7, 180, 48)",
                                  paddingRight: 10,
                                }}
                              />
                            ) : (
                              <MaterialCommunityIcons
                                name="circle-outline"
                                style={{
                                  fontSize: 20,
                                  color: "rgb(7, 180, 48)",
                                  paddingRight: 10,
                                }}
                              />
                            )}
                            <Text style={{ fontSize: 18 }}>{item.name}</Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </View>
                ),
              }[dropDownType]
            }
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  main: {
    display: "flex",
    flexDirection: "column",
    padding: 10,
  },
  card: {
    backgroundColor: "transparent",
    borderRadius: 10,
    maxWidth: 450,
    width: "110%",
    gap: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 50,
    right: 50,
  },
  circle1: {
    backgroundColor: "rgba(255, 0, 0, 1)",
    position: "absolute",
    right: 5,
    width: 70,
    height: 70,
    borderRadius: 75,
  },
  circle2: {
    backgroundColor: "rgba(255, 170, 0, 1)",
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 75,
  },
  head: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    marginInline: 30,
    fontWeight: 700,
  },
  icon: {
    color: "#000",
    fontSize: 28,
    marginBlock: 10,
    marginInline: 10,
    fontWeight: "bold",
  },
  body: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    paddingBlock: 20,
    marginBlock: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingInline: 10,
  },
  form: {
    maxWidth: 450,
    width: "80%",
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 20,
    padding: 20,
  },
  back: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    gap: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: "100%",
    outline: "none",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#f1f1f1ff",
    marginInline: 20,
    marginBottom: 10,
    maxWidth: 350,
    width: "90%",
    borderColor: "#000",
    borderWidth: 1,
    zIndex: 2,
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    padding: 10,
    borderRadius: 20,
    outline: "none",
  },
  dropDown: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 10,
    width: "80%",
    maxWidth: 350,
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    zIndex: 100,
  },
  delete: {
    position: "absolute",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
    padding: 10,
  },
});
