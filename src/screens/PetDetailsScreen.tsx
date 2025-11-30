import React, { useRef, useState, useEffect, useMemo } from "react";
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
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { makeUserUseCases } from "../core/factories/MakeUserRepository";
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY;

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
  
  const mapRef = useRef<MapView>(null);

  const [owner, setOwner] = useState<any | null>(null);
  const [viewer, setViewer] = useState<any | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { findUser } = makeUserUseCases();

  useEffect(() => {
    let mounted = true;

    // Cálculo manual (linha reta) apenas para exibição inicial
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

        const ownerUser = await findUser.execute({ id: donoId }).catch(() => null);

        if (!mounted) return;

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

        const perm = await Location.requestForegroundPermissionsAsync();
        let viewerUser = null;

        if (perm.status === "granted") {
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

          if (mounted) setDistanceKm(parseFloat(d.toFixed(1)));
        } else {
          if (mounted) setDistanceKm(null);
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

  const mapRegion = useMemo(() => {
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
            <Text style={styles.descriptionText}>
              Descrição do pet: {descricao}
            </Text>
          </View>

          <View style={styles.mapa}>
            <Text style={styles.descriptionText}>
              Localização do dono do pet:
            </Text>

            {loading ? (
              <ActivityIndicator style={{ marginTop: 12 }} color={colors.primary} />
            ) : (
              <>
                {distanceKm !== null ? (
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      marginTop: 0,
                    }}
                  >
                    {distanceKm} km (aprox.)
                  </Text>
                ) : (
                  <Text style={{ marginTop: 8 }}>
                    Distância não disponível
                  </Text>
                )}

            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              userInterfaceStyle="light" 
              style={{
                width: "100%",
                height: 300,
                borderRadius: 12,
                marginTop: 12,
              }}
              initialRegion={mapRegion}
            >
              {owner && (
                <Marker
                  coordinate={{
                    latitude: owner.latitude,
                    longitude: owner.longitude,
                  }}
                  title={owner.name}
                  description="Local do dono"
                  pinColor="purple"
                />
              )}

              {viewer && (
                <Marker
                  coordinate={{
                    latitude: viewer.latitude,
                    longitude: viewer.longitude,
                  }}
                  title="Você"
                  pinColor="#036ffc"
                />
              )}

              {owner && viewer && GOOGLE_API_KEY && (
                <MapViewDirections
                  origin={{
                    latitude: viewer.latitude,
                    longitude: viewer.longitude,
                  }}
                  destination={{
                    latitude: owner.latitude,
                    longitude: owner.longitude,
                  }}
                  apikey={GOOGLE_API_KEY}
                  strokeWidth={4}
                  strokeColor={colors.primary}
                  optimizeWaypoints={true}
                  onReady={(result) => {
                    mapRef.current?.fitToCoordinates(result.coordinates, {
                      edgePadding: {
                        right: 30,
                        bottom: 30,
                        left: 30,
                        top: 30,
                      },
                    });
                  }}
                  onError={(errorMessage) => {
                    console.log("Erro rota:", errorMessage);
                  }}
                />
              )}
            </MapView>
              </>
            )}
          </View>
        </View>
      </ScrollView>
      
      {/* Footer com botões */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          <Text style={styles.adoptButtonText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate("AdoptionMessage" as any)}
        >
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
    marginTop: 0,
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
    fontSize: 24,
    fontFamily: "Itim-Regular",
    color: colors.primary,
    marginTop: 10,
    fontWeight: "bold",
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
    width: 400,
    marginTop: 30,
    padding: 15,
    height:400,
  },
  descriptionText: {
    fontSize: 17,
  },
  footer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
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
  adoptButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});