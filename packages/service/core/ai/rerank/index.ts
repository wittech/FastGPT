import { addLog } from '../../../common/system/log';
import { POST } from '../../../common/api/serverRequest';

type PostReRankResponse = {
  id: string;
  results: {
    index: number;
    relevance_score: number;
  }[];
};
type ReRankCallResult = { id: string; score?: number }[];

export function reRankRecall({
  query,
  documents
}: {
  query: string;
  documents: { id: string; text: string }[];
}): Promise<ReRankCallResult> {
  const model = global.reRankModels[0];
  
  if (!model) {
    return Promise.reject('no rerank model');
  }
  const url = `${process.env.OPENAI_TTS_URL}/rerank`;
  let start = Date.now();
  return POST<PostReRankResponse>(
    url,
    {
      model: model.model,
      query,
      documents: documents.map((doc) => doc.text)
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_TTS_KEY}`
      },
      timeout: 30000
    }
  )
    .then((data) => {
      addLog.info('ReRank finish:', { time: Date.now() - start });

      if (!data?.results || data?.results?.length === 0) {
        addLog.error('ReRank error, empty result', data);
      }

      return data?.results?.map((item) => ({
        id: documents[item.index].id,
        score: item.relevance_score
      }));
    })
    .catch((err) => {
      addLog.error('rerank error', err);

      return [];
    });
}
