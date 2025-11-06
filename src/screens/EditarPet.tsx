import React, { useState, useEffect, useRef } from 'react';
import {
    KeyboardAvoidingView, View, Text, TextInput, Platform,
    TouchableOpacity, Alert, ActivityIndicator, StyleSheet,
    Image, Modal, ImageBackground,
    ScrollView
} from 'react-native';
import { ButtonInterface } from '../components/ButtonInterface';
import { Ionicons, EvilIcons, AntDesign } from '@expo/vector-icons'; 
import CustomHeader from '../components/Header/CustomHeader';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AreaPetStackParamList } from '../navigation/AreaPetStack';
import { makePetPerfilUseCases } from '../core/factories/MakePetPerfilRepository';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/auth';
import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

type EditarPetScreenRouteProp = RouteProp<AreaPetStackParamList, 'EditarPet'>;

const SUPABASE_BUCKET_NAME = 'pets_bucket';

export default function EditarPetScreen() {
    const route = useRoute<EditarPetScreenRouteProp>();
    const navigation = useNavigation();
    const { petId } = route.params;

    //  1. Pegar o 'uploadFile' e o 'user'
    const { findPerfilPet, updatePerfilPet, uploadFile } = makePetPerfilUseCases();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Estados do Formulário ---
    const [nome, setNome] = useState('');
    const [foto, setFoto] = useState(''); // Guarda a URL ANTIGA
    const [fotoAsset, setFotoAsset] = useState<ImagePicker.ImagePickerAsset | null>(null); // Guarda a FOTO NOVA
    const [descricao, setDescricao] = useState('');
    const [category, setCategory] = useState('');

    // --- Estados da Câmera ---
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [facing, setFacing] = useState<CameraType>('back');
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [galleryPermission, requestGalleryPermission] = ImagePicker.useMediaLibraryPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [capturedPhoto, setCapturedPhoto] = useState<CameraCapturedPicture | null>(null);

    // Carregar os dados iniciais do pet
    useEffect(() => {
        const carregarDadosPet = async () => {
            setLoading(true);
            try {
                const petParaEditar = await findPerfilPet.execute({ id: petId });
                if (petParaEditar) {
                    setNome(petParaEditar.name.value);
                    setFoto(petParaEditar.foto.url); // ✨ Carrega a URL antiga
                    setDescricao(petParaEditar.descricao);
                    setCategory(petParaEditar.category);
                } else {
                    setError('Pet não encontrado.');
                    Alert.alert('Erro', 'Pet não encontrado.');
                }
            } catch (err) {
                setError('Ocorreu um erro ao buscar os dados do pet.');
                Alert.alert('Erro', 'Não foi possível carregar os dados do pet.');
            } finally {
                setLoading(false);
            }
        };
        carregarDadosPet();
    }, [petId]);

    // --- Lógica de Permissões (copiada) ---
    async function checkGalleryPermission(): Promise<boolean> {
        if (!galleryPermission) return false;
        if (galleryPermission.status === ImagePicker.PermissionStatus.UNDETERMINED) {
            const { status } = await requestGalleryPermission();
            return status === ImagePicker.PermissionStatus.GRANTED;
        }
        if (galleryPermission.status === ImagePicker.PermissionStatus.DENIED) {
            Alert.alert('Permissão necessária', 'Precisamos da permissão da galeria.');
            return false;
        }
        return true;
    }

    async function checkCameraPermission(): Promise<boolean> {
        if (!cameraPermission) return false;
        if (cameraPermission.status === ImagePicker.PermissionStatus.UNDETERMINED) {
            const { status } = await requestCameraPermission();
            return status === ImagePicker.PermissionStatus.GRANTED;
        }
        if (cameraPermission.status === ImagePicker.PermissionStatus.DENIED) {
            Alert.alert('Permissão necessária', 'Precisamos da permissão da câmera.');
            return false;
        }
        return true;
    }
    
    // --- Lógica de Seleção de Imagem (copiada) ---
    const handlePickImageFromGallery = async () => {
        const hasPermission = await checkGalleryPermission();
        if (!hasPermission) return;
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, aspect: [4, 3], quality: 0.7, base64: true,
        });
        if (!result.canceled) {
            setFotoAsset(result.assets[0]); // ✨ Seta a FOTO NOVA
        }
    };

    const handleOpenGamera = async () => {
        const hasPermission = await checkCameraPermission();
        if (hasPermission) setShowCameraModal(true);
    };

    // --- Lógica Interna da Câmera (copiada) ---
    function toggleCameraFacing() { setFacing(current => (current === 'back' ? 'front' : 'back')); }
    async function takePicture() {
        if (cameraRef.current) {
            const picture = await cameraRef.current.takePictureAsync({ quality: 0.7, base64: true });
            setCapturedPhoto(picture);
        }
    }
    const retakePicture = () => { setCapturedPhoto(null); };
    const confirmPhoto = () => {
        if (capturedPhoto && capturedPhoto.base64) {
            const adaptedAsset: ImagePicker.ImagePickerAsset = {
                uri: capturedPhoto.uri, base64: capturedPhoto.base64, mimeType: 'image/jpeg',
                width: capturedPhoto.width, height: capturedPhoto.height,
                assetId: undefined, duration: undefined, exif: undefined,
                fileName: undefined, fileSize: undefined, type: undefined,
            };
            setFotoAsset(adaptedAsset); 
            setCapturedPhoto(null);
            setShowCameraModal(false);
        }
    };

    // ---  LÓGICA PRINCIPAL DE SALVAR ---
    const handleSalvarAlteracoes = async () => {
        setLoading(true);
        setError(null);

        if (!user || !user.id) {
            Alert.alert("Erro de Login", "Sua sessão expirou. Faça login novamente.");
            setLoading(false);
            return;
        }

        try {
            let finalPhotoUrl = foto; // 1. Começa com a URL antiga

            // 2. Verifica se o usuário escolheu uma FOTO NOVA
            if (fotoAsset) {
                console.log("Usuário selecionou uma nova foto. Iniciando upload...");
                // Se sim, faz o upload dela
                finalPhotoUrl = await uploadFile.execute({
                    imageAsset: fotoAsset,
                    bucket: SUPABASE_BUCKET_NAME,
                    userId: user.id
                });
                // (Idealmente, aqui você também deletaria a foto antiga do storage)
            }

            // 3. Salva no banco com a URL final (seja a antiga ou a nova)
            await updatePerfilPet.execute({
                petId: petId,
                nome: nome,
                photoUrl: finalPhotoUrl,
                descricao: descricao,
                category: category,
            });

            Alert.alert('Sucesso!', 'As informações do pet foram atualizadas.');
            navigation.goBack();

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Não foi possível salvar as alterações.';
            setError(errorMessage);
            Alert.alert('Erro', errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    // --- JSX (Interface) ---
    if (loading && !nome) { // Tela de loading inicial
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }
    
return (
  <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
  >
    <CustomHeader />

    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.caixa}>
        <Text style={styles.title}>Editar Pet</Text>

        <View style={styles.formRow}>
          <Ionicons name="paw-outline" style={styles.icon} />
          <TextInput
            placeholderTextColor={colors.primary}
            style={styles.input}
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.halfButton} onPress={handleOpenGamera}>
            <EvilIcons name="camera" style={styles.icon} />
            <Text style={styles.imagePickerText}>Tirar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.halfButton} onPress={handlePickImageFromGallery}>
            <Ionicons name="images-outline" style={styles.icon} />
            <Text style={styles.imagePickerText}>Galeria</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.previewContainer}>
          <Image
            source={{ uri: fotoAsset ? fotoAsset.uri : foto }}
            style={styles.imagePreview}
          />
          {fotoAsset && (
            <TouchableOpacity
              onPress={() => setFotoAsset(null)}
              style={styles.removeImageButton}
            >
              <AntDesign name="close-circle" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.formRow}>
          <Ionicons name="document-text-outline" style={styles.icon} />
          <TextInput
            placeholderTextColor={colors.primary}
            style={styles.input}
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
          />
        </View>

        <View style={styles.formRow}>
          <Ionicons name="document-text-outline" style={styles.icon} />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item
                label="Selecione uma categoria..."
                value=""
                enabled={false}
                style={{ color: colors.grey }}
              />
              <Picker.Item label="Gato" value="gato" />
              <Picker.Item label="Cachorro" value="cachorro" />
              <Picker.Item label="Outros" value="outros" />
            </Picker>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 15 }} />
        ) : (
          <ButtonInterface
            title="Salvar Alterações"
            type="primary"
            onPress={handleSalvarAlteracoes}
          />
        )}

        {error && (
          <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>{error}</Text>
        )}

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.button}
          disabled={loading}
        >
          <Text style={styles.adoptButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>

       
            <Modal visible={showCameraModal} animationType="slide" style={{ flex: 1 }}>
                 <View style={{ flex: 1, backgroundColor: colors.black }}>
                    {!capturedPhoto ? (
                        <>
                            <CameraView style={StyleSheet.absoluteFill} facing={facing} ref={cameraRef} />
                            <View style={styles.cameraHeader}>
                                <TouchableOpacity onPress={() => setShowCameraModal(false)}>
                                    <AntDesign name="close-circle" size={40} color={colors.white} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={toggleCameraFacing}>
                                    <AntDesign name="retweet" size={40} color={colors.white} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cameraFooter}>
                                <TouchableOpacity onPress={takePicture} style={styles.ball} />
                            </View>
                        </>
                    ) : (
                        <ImageBackground source={{ uri: capturedPhoto.uri }} style={styles.fullScreenImagePreview}>
                            <View style={styles.cameraHeader}>
                                <TouchableOpacity onPress={retakePicture}>
                                    <AntDesign name="retweet" size={40} color={colors.white} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={confirmPhoto}>
                                    <AntDesign name="check-circle" size={40} color={colors.white} />
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    )}
                </View>
            </Modal>
          </KeyboardAvoidingView>
    );
}

// --- ESTILOS ---

const colors = {
    background: '#EEE6FF',
    primary: '#392566',
    secundary: '#F4F3F3',
    grey: '#888',
    black: '#000', // Adicionado
    white: '#fff', // Adicionado
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
      scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
    caixa: {
        width: '90%', 
        backgroundColor: colors.secundary,
        borderRadius: 20, 
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        paddingVertical: 30, 
        paddingHorizontal: 15,
    },
    title: {
        fontSize: 30,
        fontFamily: "Itim-Regular",
        textAlign: 'center',
        color: colors.primary,
        marginBottom: 20,
    },
    formRow: {
        marginBottom: 15, 
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1, 
        borderColor: '#d3cfcf',
        borderRadius: 10,
        width: '95%', 
        backgroundColor: '#fff', 
        paddingHorizontal: 10, 
    },
    icon: {
        fontSize: 24, 
        color: colors.primary,
        marginRight: 10, 
    },
    input: {
        flex: 1, 
        fontSize: 16,
        height: 50,
        color: colors.primary,
    },
    pickerContainer: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
    },
    picker: {
        width: '100%',
        height: '110%',
        color: colors.primary,
    },
    button: {
        backgroundColor: '#392566',
        borderRadius: 20,
        marginTop: 15,
        width: 120,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    adoptButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Itim-regular',
    },

    // --- ✨ ESTILOS NOVOS/ATUALIZADOS ---
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%',
        marginBottom: 15,
    },
    halfButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.primary,
        borderStyle: 'dashed',
        borderRadius: 10,
        width: '48%', 
        backgroundColor: '#fff',
        paddingVertical: 15,
    },
    imagePickerText: {
        fontSize: 14, 
        color: colors.primary,
        fontFamily: "Itim-Regular",
    },
    previewContainer: {
        position: 'relative',
    },
    imagePreview: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: colors.grey,
        backgroundColor: '#e0e0e0' // Um fundo para enquanto a URL antiga carrega
    },
    removeImageButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: colors.secundary,
        borderRadius: 12,
    },
    cameraHeader: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 1,
    },
    cameraFooter: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1,
    },
    ball: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.white,
        borderWidth: 5,
        borderColor: colors.grey,
    },
    fullScreenImagePreview: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'space-between',
    },
});