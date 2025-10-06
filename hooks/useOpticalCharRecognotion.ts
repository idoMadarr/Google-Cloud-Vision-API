import {useState} from 'react';
import {NativeModules, Platform} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import axios from 'axios';

const {TextDetectionModule} = NativeModules;

const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY_HERE';

const useOpticalCharRecognotion = () => {
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState('');

  const googleOCR = async () => {
    const result = await launchCamera({mediaType: 'photo', quality: 1});
    if (!result.assets || !result.assets[0].uri) return;

    const uri = result.assets[0].uri;
    setImageSource(uri);

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

      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
        body,
        {headers: {'Content-Type': 'application/json'}},
      );

      const text =
        response.data.responses[0]?.fullTextAnnotation?.text || 'No text found';
      setGeneratedText(text);
    } catch (error) {
      console.log(JSON.stringify(error));
      setGeneratedText('OCR failed.');
    }
  };

  const nativeOCR = async () => {
    const result = await launchCamera({mediaType: 'photo', quality: 1});
    if (!result.assets || !result.assets[0].uri) return;
    const uri = result.assets[0].uri;

    setImageSource(uri);

    // Native Android does not support hebrew yet:
    // Checkout all the supported languages:
    // https://developers.google.com/ml-kit/vision/text-recognition/v2/languages
    if (Platform.OS === 'android') {
      try {
        const result = await TextDetectionModule.recognizeImage(uri);
        const text =
          result.blocks.map((block: any) => block.text).join('\n') ||
          'No text found';
        setGeneratedText(text);
      } catch (error) {
        console.log(JSON.stringify(error));
        setGeneratedText('Native OCR failed.');
      }
    } else {
      setGeneratedText('IOS Dont implemented yet.');
    }
  };

  return {googleOCR, nativeOCR, imageSource, generatedText};
};

export default useOpticalCharRecognotion;
