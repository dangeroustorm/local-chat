import { pipeline, TextStreamer, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3';

// 禁用本地检索，允许浏览器缓存
env.allowLocalModels = false;
env.useBrowserCache = true;

const MODEL_ID = 'onnx-community/Apertus-v1.1-0.5B-Instruct-ONNX';

class PipelineSingleton {
  static task = 'text-generation';
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, MODEL_ID, {
        device: 'webgpu',
        dtype: 'q4',
        config: { model_type: 'llama' }, // 覆写 model_type 避开解析异常
        progress_callback,
      });
    }
    return this.instance;
  }
}

// 监听主线程指令
self.addEventListener('message', async (e) => {
  const { type, data } = e.data;

  if (type === 'load') {
    try {
      await PipelineSingleton.getInstance((progress) => {
        self.postMessage({ status: 'progress', progress });
      });
      self.postMessage({ status: 'ready' });
    } catch (error) {
      self.postMessage({ status: 'error', error: error.message });
    }
  } else if (type === 'generate') {
    try {
      const generator = await PipelineSingleton.getInstance();
      
      const streamer = new TextStreamer(generator.tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function: (token) => {
          self.postMessage({ status: 'update', token });
        }
      });

      const messages = [
        { role: 'system', content: 'You are Apertus, a helpful AI assistant.' },
        ...data.history,
        { role: 'user', content: data.text }
      ];

      await generator(messages, {
        max_new_tokens: 256,
        temperature: 0.6,
        streamer: streamer,
      });

      self.postMessage({ status: 'complete' });
    } catch (error) {
      self.postMessage({ status: 'error', error: error.message });
    }
  }
});