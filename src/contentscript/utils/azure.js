/* eslint-disable import/no-cycle */
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  SpeechConfig, ResultReason, AudioConfig, SpeechSynthesizer, SpeechRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk';
import { requestGpt } from '../api';
import { getTranscript } from '../transcript';

const speechConfig = SpeechConfig.fromSubscription('ad9574a6101a4ac99f743a6e59aed669', 'japanwest');

export function synthesizeSpeech(text) {
  const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
  // 语言合成输出结果为中文
  speechConfig.speechSynthesisVoiceName = 'zh-CN-XiaochenNeural';
  const speechSynthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

  speechSynthesizer.speakTextAsync(
    text,
    (result) => {
      if (result) {
        speechSynthesizer.close();
        return result.audioData;
      }
    },
    (error) => {
      console.log(error);
      speechSynthesizer.close();
    },
  );
}

export async function recognizeSpeech() {
  // 识别语音为中文
  speechConfig.speechRecognitionLanguage = 'zh-CN';
  // 音频配置为默认麦克风输入
  const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
  // 创建语音识别器
  const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

  recognizer.recognizeOnceAsync(async (result) => {
    if (result.reason === ResultReason.RecognizedSpeech) {
      // 获取字幕从videoId开始
      const transcript = await getTranscript();
      let { text } = result;
      if (transcript) {
        text = `${text}。you could refer to the following text:${transcript}`;
      }
      const res = await requestGpt(text, false);
      synthesizeSpeech(res);
    } else {
      synthesizeSpeech('臣妾没有听清，劳烦陛下请再说一遍。');
    }
    recognizer.close();
  });
}
