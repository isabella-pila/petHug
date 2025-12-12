import React, { useState, useRef } from 'react';
import {
    KeyboardAvoidingView, View, Text, TextInput, Platform,
    TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image, Modal,
    ImageBackground 
} from 'react-native';
import { ButtonInterface } from '../components/ButtonInterface';
import { EvilIcons, Ionicons, AntDesign, FontAwesome6, FontAwesome5 } from '@expo/vector-icons';
import CustomHeader from '../components/Header/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/auth';
import { makePetPerfilUseCases } from '../core/factories/MakePetPerfilRepository';
import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

import { ScrollView } from 'react-native';

const SUPABASE_BUCKET_NAME = 'pets_bucket';

export default function CadastrarPetScreen() {
    const navigation = useNavigation();
    const { registerPerfilPet, uploadFile } = makePetPerfilUseCases();
    const { user } = useAuth();

    const [nome, setNome] = useState('');
    const [fotoAsset, setFotoAsset] = useState<ImagePicker.ImagePickerAsset | null>(null); 
    const [descricao, setDescricao] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const [showCameraModal, setShowCameraModal] = useState(false);
    const [facing, setFacing] = useState<CameraType>('back');
    const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [capturedPhoto, setCapturedPhoto] = useState<CameraCapturedPicture | null>(null);

 
    const [galleryPermission, requestGalleryPermission] = ImagePicker.useMediaLibraryPermissions();

 
    async function checkGalleryPermission(): Promise<boolean> {
        if (!galleryPermission) return false; // Ainda carregando

        if (galleryPermission.status === ImagePicker.PermissionStatus.UNDETERMINED) {
            const { status } = await requestGalleryPermission();
            return status === ImagePicker.PermissionStatus.GRANTED;
        }

        if (galleryPermission.status === ImagePicker.PermissionStatus.DENIED) {
            Alert.alert('Permissão necessária', 'Precisamos da permissão da galeria para escolher uma foto.');
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
            Alert.alert('Permissão necessária', 'Precisamos da permissão da câmera para tirar uma foto.');
            return false;
        }
        return true;
    }



    const handlePickImageFromGallery = async () => {
        const hasPermission = await checkGalleryPermission();
        if (!hasPermission) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
            base64: true, 
        });

        if (!result.canceled) {
            setFotoAsset(result.assets[0]); 
        }
    };

    const handleOpenGamera = async () => {
        const hasPermission = await checkCameraPermission();
        if (hasPermission) {
            setShowCameraModal(true); 
        }
    };

  
    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    async function takePicture() {
        if (cameraRef.current) {
            const picture = await cameraRef.current.takePictureAsync({
                quality: 0.7,
                base64: true,
            });
            setCapturedPhoto(picture);
        }
    }

    const confirmPhoto = () => {
        if (capturedPhoto && capturedPhoto.base64) {
           
            const adaptedAsset: ImagePicker.ImagePickerAsset = {
                uri: capturedPhoto.uri,
                base64: capturedPhoto.base64,
                mimeType: 'image/jpeg',
                width: capturedPhoto.width,
                height: capturedPhoto.height,
               
                assetId: undefined, duration: undefined, exif: undefined,
                fileName: undefined, fileSize: undefined, type: undefined,
            };
            setFotoAsset(adaptedAsset); 
            setCapturedPhoto(null);
            setShowCameraModal(false);
        }
    };

    const retakePicture = () => {
        setCapturedPhoto(null);
    };

   

    const handleCadastrar = async () => {
  
        if (!nome || !fotoAsset || !descricao || !category) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos e selecione uma foto.');
            return;
        }
        if (!user || !user.id) {
            Alert.alert('Erro', 'Você não está logado.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
          
            const finalPhotoUrl = await uploadFile.execute({
                imageAsset: fotoAsset,
                bucket: SUPABASE_BUCKET_NAME,
                userId: user.id
            });

        
            await registerPerfilPet.execute({
                nome,
                photoUrl: finalPhotoUrl,
                descricao,
                category,
                donoId: user.id,
            });

            Alert.alert('Sucesso!', 'Seu pet foi cadastrado!');
            navigation.goBack();

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Não foi possível cadastrar o pet.';
            setError(errorMessage);
            Alert.alert('Erro', errorMessage);
        } finally {
            setLoading(false);
        }
    };

return (
  <View style={styles.container}>
    <CustomHeader />

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.caixa}>
          <Text style={styles.title}>Cadastrar Pet</Text>

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

          {fotoAsset && (
            <View style={styles.previewContainer}>
              <Image source={{ uri: fotoAsset.uri }} style={styles.imagePreview} />
              <TouchableOpacity onPress={() => setFotoAsset(null)} style={styles.removeImageButton}>
                <AntDesign name="close-circle" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}

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
            <Ionicons name="apps-outline" style={styles.icon} />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecione uma categoria..." value="" enabled={false} />
                <Picker.Item label="Gato" value="gato" />
                <Picker.Item label="Cachorro" value="cachorro" />
                <Picker.Item label="Outros" value="outros" />
              </Picker>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 15 }} />
          ) : (
            <ButtonInterface title="Cadastrar" type="primary" onPress={handleCadastrar} />
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

        
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} disabled={loading}>
            <Text style={styles.adoptButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    

            
            <Modal visible={showCameraModal} animationType="slide" style={{ flex: 1 }}>
                 <View style={{ flex: 1, backgroundColor: colors.black }}>
                    {!capturedPhoto ? (
                        <>
                            <CameraView style={StyleSheet.absoluteFill} facing={facing} ref={cameraRef} />
                            <View style={styles.cameraHeader}>
                                  <TouchableOpacity onPress={toggleCameraFacing}>
                                    <AntDesign name="retweet" size={40} color={colors.white} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setShowCameraModal(false)}>
                                    <AntDesign name="close-circle" size={40} color={colors.red} />
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
                                   <FontAwesome5 name="check-circle" size={40} color={colors.background} />
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    )}
                </View>
            </Modal>
        </View>
    );
}



const colors = {
    background: '#EEE6FF',
    primary: '#392566',
    secundary: '#F4F3F3',
    grey: '#888',
    black: '#000',
    white: '#fff',
    red:'#FF0000',
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
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Itim-Regular',
    textAlign: 'center',
    color: colors.primary,
    marginBottom: 20,
  },
  formRow: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d3cfcf',
    borderRadius: 10,
    width: '100%',
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
    color: colors.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  halfButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: 'Itim-Regular',
  },
  previewContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  imagePreview: {
    width: 160,
    height: 160,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: colors.secundary,
    borderRadius: 12,
  },
  backButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    marginTop: 20,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  adoptButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Itim-Regular',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
    cameraHeader: {
        position: 'absolute',
        top: 50, // Um pouco mais para baixo, seguro
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 1,
    },
    cameraFooter: {
        position: 'absolute',
        bottom: 50, 
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1,
    },
    ball: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.background,
        borderWidth: 5,
        borderColor: colors.primary,
    },
    fullScreenImagePreview: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'space-between',
    },
}); 