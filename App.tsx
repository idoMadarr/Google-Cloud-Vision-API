import React, {useState} from 'react';
import {Button, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import axios from 'axios';
import RNFS from 'react-native-fs';

const GOOGLE_API_KEY = 'GOOGLE_API_KEY'; // ⚠️ store securely later!

function App(): React.JSX.Element {
  const [ocrText, setOcrText] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const onCapture = async () => {
    const result = await launchCamera({mediaType: 'photo', quality: 1});
    if (!result.assets || !result.assets[0].uri) return;

    const uri = result.assets[0].uri;
    setImageUri(uri);

    try {
      // Convert to base64
      const base64Img = await RNFS.readFile(uri, 'base64');

      const body = {
        requests: [
          {
            image: {content: base64Img},
            features: [{type: 'TEXT_DETECTION'}],
          },
        ],
      };

      console.log('Request body prepared:', body);

      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
        body,
        {headers: {'Content-Type': 'application/json'}},
      );

      const text =
        response.data.responses[0]?.fullTextAnnotation?.text || 'No text found';
      setOcrText(text);
    } catch (error) {
      console.log(JSON.stringify(error));
      setOcrText('OCR failed.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Google Vision OCR</Text>
      <Button title="Capture Document" onPress={onCapture} />
      {imageUri && <Image source={{uri: imageUri}} style={styles.image} />}
      {ocrText ? <Text style={styles.ocrText}>{ocrText}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 20},
  image: {width: 300, height: 400, resizeMode: 'contain', marginVertical: 20},
  ocrText: {fontSize: 16, textAlign: 'right', writingDirection: 'rtl'}, // ✅ Hebrew friendly
});

export default App;
