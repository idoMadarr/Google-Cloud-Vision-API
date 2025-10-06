import React from 'react';
import {Button, Image, ScrollView, StyleSheet, Text} from 'react-native';
import useOpticalCharRecognotion from './hooks/useOpticalCharRecognotion';

const App: React.FC = () => {
  const {generatedText, imageSource, nativeOCR, googleOCR} =
    useOpticalCharRecognotion();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title={'Google Vision OCR'} onPress={googleOCR} />

      <Button title={'Native Vision OCR'} onPress={nativeOCR} />
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
    padding: 20,
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
