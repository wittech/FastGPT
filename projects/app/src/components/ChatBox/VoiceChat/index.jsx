import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import WebSocketConnectMethod from './wsconnecter';
import Recorder from 'recorder-core/recorder.wav.min.js';
import MyIcon from '@fastgpt/web/components/common/Icon';
import { useChatProviderStore } from '../Provider';

const GIF_STATE = Object.freeze({
  WAITING: 'waiting',
  LISTENING: 'listening',
  SPEAKING: 'speaking',
  THINKING: 'thinking'
});
const gifs = {
  [GIF_STATE.WAITING]: '/imgs/voicechat/waiting.gif',
  [GIF_STATE.LISTENING]: '/imgs/voicechat/listening.gif',
  [GIF_STATE.SPEAKING]: '/imgs/voicechat/speaking.gif',
  [GIF_STATE.THINKING]: '/imgs/voicechat/thinking.gif'
};

let ws, rec, text, sampleBuf;

const VoiceChat = ({ onSendMessage, onClose }) => {
  const { isChatting, audioPlaying, cancelAudio } = useChatProviderStore();
  const [gifState, setGifState] = useState(GIF_STATE.WAITING);
  const [recordingDisabled, setRecordingDisabled] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    rec = Recorder({
      type: 'wav',
      bitRate: 16,
      sampleRate: 16000,
      onProcess: recProcess
    });

    rec.open(() => {
      ws = new WebSocketConnectMethod({
        msgHandle: getJsonMessage,
        stateHandle: getConnState
      });
      ws.wsStart();
    });

    return () => {
      ws?.wsStop();
      ws = undefined;
      rec = undefined;
    };
  }, []);

  function recProcess(
    buffer,
    powerLevel,
    bufferDuration,
    bufferSampleRate,
    newBufferIdx,
    asyncEnd
  ) {
    const data_48k = buffer[buffer.length - 1];
    const array_48k = new Array(data_48k);
    const data_16k = Recorder.SampleData(array_48k, bufferSampleRate, 16000).data;
    sampleBuf = Int16Array.from([...sampleBuf, ...data_16k]);
    const chunk_size = 960;
    while (sampleBuf.length >= chunk_size) {
      const sendBuf = sampleBuf.slice(0, chunk_size);
      sampleBuf = sampleBuf.slice(chunk_size, sampleBuf.length);
      ws.wsSend(sendBuf);
    }
  }

  // 语音识别结果; 对jsonMsg数据解析,将识别结果附加到编辑框中
  function getJsonMessage(jsonMsg) {
    const rectxt = '' + JSON.parse(jsonMsg.data)['text'];
    const asrmodel = JSON.parse(jsonMsg.data)['mode'];
    const is_final = JSON.parse(jsonMsg.data)['is_final'];
    const timestamp = JSON.parse(jsonMsg.data)['timestamp'];

    if (asrmodel == '2pass-offline' || asrmodel == 'offline') {
      text += rectxt;
    }
    console.log(text);
    if (is_final) {
      if (text) {
        onSendMessage({ text: text.trim(), autoTTSResponse: true });
      } else {
        setGifState(GIF_STATE.WAITING);
        setRecordingDisabled(false);
      }
    }
  }

  function getConnState(connState) {
    if (connState === 0) {
      //on open
      setLoaded(true);
      setRecordingDisabled(false);
    } else if (connState === 1) {
      //stop();
    } else if (connState === 2) {
      stop();
      console.log('connecttion error');
    }
  }

  const startRecording = () => {
    console.log('开始');
    text = '';
    sampleBuf = new Int16Array();
    rec.start();
    setGifState(GIF_STATE.LISTENING);
  };

  const stopRecording = () => {
    // 发送剩余数据块
    var chunk_size = new Array(5, 10, 5);
    var request = {
      chunk_size: chunk_size,
      wav_name: 'h5',
      is_speaking: false,
      chunk_interval: 10,
      mode: '2pass'
    };

    if (sampleBuf.length > 0) {
      ws.wsSend(sampleBuf);
      sampleBuf = new Int16Array();
    }
    ws.wsSend(JSON.stringify(request));

    rec.stop(
      function (blob, duration) {
        setGifState(GIF_STATE.THINKING);
        setRecordingDisabled(true);
      },
      function (errMsg) {
        console.log('rec.stop errMsg: ' + errMsg);
      }
    );
  };

  /**
   * 处理显示状态
   */
  useEffect(() => {
    if (isChatting) {
      setGifState(GIF_STATE.THINKING);
      setRecordingDisabled(true);
    } else if (audioPlaying && !isChatting) {
      setGifState(GIF_STATE.SPEAKING);
      setRecordingDisabled(true);
    } else {
      setGifState(GIF_STATE.WAITING);
      setRecordingDisabled(false);
    }
  }, [audioPlaying, isChatting]);

  const handleClose = () => {
    ws?.wsStop();
    ws = undefined;
    rec?.close();
    rec = undefined;

    cancelAudio();
    onClose();
  };

  return (
    <div
      className={styles.chatgpt}
      style={{
        backgroundImage: `url(${gifs[gifState]})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <MyIcon
        className={styles.x}
        name="closeSolid"
        width={'20px'}
        height={'20px'}
        color={'#fff'}
        onClick={handleClose}
      />
      {!loaded && <span className={styles.connecting}>连接中...</span>}
      {recordingDisabled ? (
        <button key="1" className={styles['record-button-disabled']}>
          按住
        </button>
      ) : (
        <button
          key="2"
          className={styles['record-button']}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
        >
          按住
        </button>
      )}
    </div>
  );
};

export default VoiceChat;
