import { supabase } from '../supabase';

const useSingleTopics = () => {
 
  const fetchSingleDebateTopic = async (conversationId: string) => {
    const { data: conversationTopic, error: conversationError } = await supabase
      .from('conversations')
      .select()
      .eq('conversation_id', conversationId).single();

    if (conversationError) {
      console.error('Error fetching conversation:', conversationError);
      return;
    }

    if (conversationTopic) {
      return conversationTopic;
    }
  };

  return {
    fetchSingleDebateTopic,
  };
};

export default useSingleTopics;
