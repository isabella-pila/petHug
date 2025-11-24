import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "./../navigation/HomeStack";
import CustomHeader from "../components/Header/CustomHeader";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { makeUserUseCases } from "../core/factories/MakeUserRepository";

type PetDetailsRouteProp = RouteProp<HomeStackParamList, "PetDetails">;
type PetDetailsNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "PetDetails"
>;

type Props = {
  route: PetDetailsRouteProp;
};

export default function PetDetailsScreen({ route }: Props) {
  const { id, title, image, descricao, donoId } = route.params as any;

  const navigation = useNavigation<PetDetailsNavigationProp>();

  const [owner, setOwner] = React.useState<any | null>(null);
  const [viewer, setViewer] = React.useState<any | null>(null);
  const [distanceKm, setDistanceKm] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const { findUser } = makeUserUseCases();

  React.useEffect(() => {
    let mounted = true;

    const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const toRad = (v: number) => (v * Math.PI) / 180;

      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const load = async () => {
      try {
        setLoading(true);

        // 1️⃣ Buscar DONO corretamente
        const ownerUser = await findUser.execute({ id: donoId }).catch(() => null);

        if (!mounted) return;

        if (!ownerUser) {
          console.warn("Dono não encontrado no banco.");
        } else if (
          ownerUser.location.latitude === 0 ||
          ownerUser.location.longitude === 0
        ) {
          console.warn("Dono encontrado, mas localização = 0 (não definida).");
        }

        setOwner(
          ownerUser
            ? {
                id: ownerUser.id,
                name: ownerUser.name.value,
                latitude: ownerUser.location.latitude,
                longitude: ownerUser.location.longitude,
              }
            : null
        );

        // 2️⃣ Tentar buscar localização de quem está vendo
        let viewerUser = null;

        const sessionUser = await Location.requestForegroundPermissionsAsync();
        if (sessionUser.status === "granted") {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          viewerUser = {
            id: "viewer",
            name: "Você",
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
        }

        if (!mounted) return;
        setViewer(viewerUser);

        // 3️⃣ Calcular distância
        if (
          viewerUser &&
          ownerUser &&
          ownerUser.location.latitude &&
          ownerUser.location.longitude
        ) {
          const d = getDistanceKm(
            viewerUser.latitude,
            viewerUser.longitude,
            ownerUser.location.latitude,
            ownerUser.location.longitude
          );

          setDistanceKm(parseFloat(d.toFixed(1)));
        } else {
          setDistanceKm(null);
        }
      } catch (error) {
        console.warn("Erro ao carregar localização:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [donoId]);

  const handleAdoptPress = () => {
    navigation.navigate("AdoptionMessage" as any);
  };

  const mapRegion = React.useMemo(() => {
    const lat = owner?.latitude ?? viewer?.latitude ?? -23.5489;
    const lng = owner?.longitude ?? viewer?.longitude ?? -46.6388;

    return {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }, [owner, viewer]);

  return (
    <View style={styles.container}>
      <CustomHeader />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          <View style={styles.img}>
            <Image
              source={typeof image === "string" ? { uri: image } : image}
              style={styles.petImage}
            />
            <Text style={styles.title}>{title}</Text>
          </View>

          <View style={styles.caixa}>
            <Text style={styles.descriptionText}>Descrição do pet: {descricao}</Text>
          </View>

          <View style={styles.mapa}>
            <Text style={styles.descriptionText}>Localização e distância</Text>

            {loading ? (
              <ActivityIndicator style={{ marginTop: 12 }} />
            ) : (
              <>
                {distanceKm !== null ? (
                  <Text style={{ fontSize: 18, fontWeight: "700", marginTop: 8 }}>
                    {distanceKm} km de distância
                  </Text>
                ) : (
                  <Text style={{ marginTop: 8 }}>Distância não disponível</Text>
                )}

                <MapView
                  style={{ width: "100%", height: 200, borderRadius: 12, marginTop: 12 }}
                  region={mapRegion}
                >
                  {owner && (
                    <Marker
                      coordinate={{ latitude: owner.latitude, longitude: owner.longitude }}
                      title={owner.name}
                      description="Local do dono"
                      pinColor={"purple"}
                    />
                  )}

                  {viewer && (
                    <Marker
                      coordinate={{
                        latitude: viewer.latitude,
                        longitude: viewer.longitude,
                      }}
                      title="Você"
                      description="Sua posição"
                      pinColor={"blue"}
                    />
                  )}
                </MapView>
              </>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          <Text style={styles.adoptButtonText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleAdoptPress}>
          <Text style={styles.adoptButtonText}>Adotar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const colors = {
  background: "#EEE6FF",
  primary: "#392566",
  secundary: "#C8B2F6",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  button: {
    backgroundColor: "#392566",
    borderRadius: 20,
    margin: 15,
    width: 120,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 20,
  },
  contentContainer: {
    alignItems: "center",
    width: "100%",
  },
  img: {
    marginTop: 20,
    alignItems: "center",
  },
  petImage: {
    height: 200,
    width: 300,
    borderRadius: 20,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 15,
  },
  caixa: {
    backgroundColor: colors.secundary,
    borderRadius: 20,
    width: 300,
    padding: 15,
    marginTop: 10,
  },
  mapa: {
    backgroundColor: colors.secundary,
    borderRadius: 20,
    width: 300,
    marginTop: 30,
    padding: 15,
  },
  descriptionText: {
    fontSize: 17,
  },
  footer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  adoptButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
