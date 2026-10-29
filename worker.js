import { pipeline, TextStreamer, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3';

// 允许浏览器 HTTP 缓存，禁用本地查找
env.allowLocalModels = false;
env.useBrowserCache = true;

const MODEL_ID = 'onnx-community/Apertus-v1.1-0.5B-Instruct-ONNX';
let generator = null;

self.addEventListener('message', async (e) => {
  const { type, data } = e.data;

  if (type === 'load') {
    try {
      // 显式覆写 model_type 为 llama，使 Transformers.js v3 正确映射 Apertus 的底层 GQA 架构
      generator = await pipeline('text-generation', MODEL_ID, {
        device: 'webgpu',
        dtype: 'q4',
        config: { model_type: 'llama' },
        progress_callback: (p) => {
          self.postMessage({ status: 'progress', detail: p });
        }
      });

      self.postMessage({ status: 'ready' });
    } catch (err) {
      console.error('Worker Inner Load Error:', err);
      self.postMessage({ status: 'error', error: err.message || String(err) });
    }
  } else if (type === 'generate') {
    try {
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
    } catch (err) {
      console.error('Worker Generation Error:', err);
      self.postMessage({ status: 'error', error: err.message || String(err) });
    }
  }
});
