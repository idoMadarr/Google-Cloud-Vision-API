import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import useOpticalCharRecognotion from './hooks/useOpticalCharRecognotion';

const App: React.FC = () => {
  const {generatedText, imageSource, nativeOCR, googleOCR} =
    useOpticalCharRecognotion();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={'white'} />
      <Text style={{fontSize: 20}}>- Optical Character Recognition -</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonTitle}>Google Vision OCR</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonTitle}>Native Vision OCR</Text>
      </TouchableOpacity>
      {imageSource && (
        <Image source={{uri: imageSource}} style={styles.image} />
      )}
      {generatedText ? (
        <Text style={styles.ocrText}>{generatedText}</Text>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  button: {
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    margin: 10,
    backgroundColor: 'blue',
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
  },
  image: {
    width: 300,
    height: 400,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  ocrText: {
    fontSize: 16,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default App;
