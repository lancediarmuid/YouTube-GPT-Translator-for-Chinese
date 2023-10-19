/* eslint-disable import/no-cycle */
import { OpenAI } from 'langchain/llms/openai';
import { loadSummarizationChain } from 'langchain/chains';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { truncateTranscript, readLocalStorage } from '../utils';

export default async function summarize(text) {
  let apikey = '';
  try {
    apikey = await readLocalStorage();
  } catch (e) {
    return e;
  }

  if (!apikey) {
    return 'Please input your OpenAI API Key';
  }
  const truncatedText = truncateTranscript(text);
  const model = new OpenAI({
    openAIApiKey: apikey,
    temperature: 0,
  });
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 2000 });
  const docs = await textSplitter.createDocuments([truncatedText]);

  const chain = loadSummarizationChain(model, { type: 'map_reduce', returnIntermediateSteps: true });
  const res = await chain.call({
    input_documents: docs,
  });
  return res;
}
