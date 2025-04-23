import React, { useEffect, useState, useCallback } from "react";
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { FONTS } from "../theme/fonts";
import { getCdekSities } from "../services/API/merch";
import { useSelector } from "react-redux";
import LabelInput from "./label-input";

const PickupPointsModal = ({ isVisibleModal, onPressBack, setSelectPickup }: any) => {
    const [allPickupPoints, setAllPickupPoints] = useState<any[]>([]); // Полный список
    const [filteredPickupPoints, setFilteredPickupPoints] = useState<any[]>([]); // Фильтрованный список
    const [selectedPoint, setSelectedPoint] = useState<any>(null);
    const [city, setCity] = useState(''); // Поле поиска
    const [isLoading, setIsLoading] = useState(false);

    const tokenFromReducer = useSelector((store: any) => store.user_token.user_token);

    const handleGetPickups = useCallback(async () => {
        setIsLoading(true);
        try {
            const cities = await getCdekSities(tokenFromReducer); // Один запрос без параметров
            setAllPickupPoints(cities);
            setFilteredPickupPoints(cities); // Устанавливаем фильтрованный список
        } catch (error) {
            console.log(error, "Error handleGetPickups");
        } finally {
            setIsLoading(false);
        }
    }, [tokenFromReducer]);

    useEffect(() => {
        handleGetPickups(); // Получаем данные при первом рендере
    }, [handleGetPickups]);

    useEffect(() => {
        // Локальный фильтр по адресу
        if (city.trim().length > 0) {
            const filtered = allPickupPoints.filter((item) =>
                item?.location?.address_full
                    ?.toLowerCase()
                    .includes(city.trim().toLowerCase())
            );
            setFilteredPickupPoints(filtered);
        } else {
            // Показываем весь список, если поле поиска пустое
            setFilteredPickupPoints(allPickupPoints);
        }
    }, [city, allPickupPoints]);

    const renderPickupPoint = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.radioButtonContainer}
            onPress={() => setSelectedPoint(item)}
        >
            <View style={styles.radioCircle}>
                {selectedPoint === item && <View style={styles.radioSelected} />}
            </View>
            <Text style={styles.pickupPointText}>{item?.location?.address_full}</Text>
        </TouchableOpacity>
    );

    return (
        <Modal style={{ margin: 0 }} visible={isVisibleModal}>
            <View style={styles.container}>
                <Text style={styles.title}>Выберите пункт выдачи</Text>
                <LabelInput
                    placeholder="Поиск"
                    value={city}
                    onChangeText={setCity} // Обновляем стейт поиска
                />
                {isLoading ? (
                    <Text>Загрузка...</Text>
                ) : (
                    filteredPickupPoints.length > 0 ? (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={filteredPickupPoints}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderPickupPoint}
                            contentContainerStyle={styles.listContainer}
                        />
                    ) : (
                        <Text style={styles.emptyListText}>Список пуст</Text>
                    )
                )}
                <TouchableOpacity
                    onPress={() => setSelectPickup(selectedPoint)}
                    style={styles.selectButton}
                >
                    <Text style={styles.buttonText}>Выбрать</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressBack} style={styles.backButton}>
                    <Text style={[styles.buttonText, { color: "#222222" }]}>Назад</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default PickupPointsModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 24,
        paddingVertical: 24,
        borderRadius: 8,
        marginTop: 44,
    },
    title: {
        fontSize: 20,
        color: "#222",
        lineHeight: 24,
        fontFamily: FONTS.Manrope600,
        textAlign: "left",
        marginBottom: 16,
    },
    listContainer: {
        paddingVertical: 14,
    },
    radioButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        maxWidth: "90%",
    },
    radioCircle: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    radioSelected: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: "#000",
    },
    pickupPointText: {
        fontSize: 16,
        color: "#222",
        fontFamily: FONTS.Manrope400,
    },
    selectButton: {
        backgroundColor: "#000",
        borderRadius: 8,
        alignItems: "center",
        marginTop: 16,
        height: 64,
        justifyContent: "center",
    },
    backButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontFamily: FONTS.Manrope500,
    },
    emptyListText: {
        color: "#000",
        fontSize: 18,
        textAlign: "center",
    },
});
