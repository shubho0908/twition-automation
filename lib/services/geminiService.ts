import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger';
import { handleError } from '../utils/errorHandler';
import type { NotionTask, TwitterContent } from '../types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const createTwitterPost = async (tasks: NotionTask[]): Promise<TwitterContent> => {
  try {
    logger.info('Creating Twitter post from tasks', { taskCount: tasks.length });

    const combinedContent = tasks.map(task => 
      `${task.title}\n${task.content}`
    ).join('\n\n');

    const contentLength = combinedContent.length;
    logger.info(`Combined content length: ${contentLength} characters`);

    if (contentLength <= 280) {
      return await createSingleTweet(combinedContent);
    } else if (contentLength <= 430) {
      return await createSummarizedTweet(combinedContent);
    } else {
      return await createTwitterThread(combinedContent);
    }

  } catch (error) {
    await handleError(error as Error, 'createTwitterPost');
    throw error;
  }
};

const createSingleTweet = async (content: string): Promise<TwitterContent> => {
  try {
    const prompt = createTwitterPrompt(content);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const tweetText = response.text().trim();

    if (tweetText.length > 280) {
      logger.warn(`Generated single tweet is ${tweetText.length} chars, creating thread instead`);
      return await createTwitterThread(content);
    }

    logger.info('Generated single tweet', { length: tweetText.length });

    return {
      type: 'single',
      content: tweetText
    };

  } catch (error) {
    await handleError(error as Error, 'createSingleTweet');
    throw error;
  }
};

const createSummarizedTweet = async (content: string): Promise<TwitterContent> => {
  try {
    const prompt = `
Summarize the following tasks into a single Twitter post that is EXACTLY 280 characters or less.

Content to summarize:
${content}

Requirements:
- MAXIMUM 280 characters (this is critical - count every character)
- Include relevant emojis to save space
- Focus only on the most important achievements
- Be concise but engaging
- Professional but personable tone

Return only the tweet text, no extra formatting:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const tweetText = response.text().trim();

    if (tweetText.length > 280) {
      logger.warn(`Generated tweet is ${tweetText.length} chars, creating thread instead`);
      return await createTwitterThread(content);
    }

    logger.info('Generated summarized tweet', { length: tweetText.length });

    return {
      type: 'single',
      content: tweetText
    };

  } catch (error) {
    await handleError(error as Error, 'createSummarizedTweet');
    throw error;
  }
};

const createTwitterThread = async (content: string): Promise<TwitterContent> => {
  try {
    const prompt = createThreadPrompt(content);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const threadText = response.text();

    const tweets = parseThreadResponse(threadText);
    
    logger.info('Generated Twitter thread', { tweetCount: tweets.length });

    return {
      type: 'thread',
      content: tweets
    };

  } catch (error) {
    await handleError(error as Error, 'createTwitterThread');
    throw error;
  }
};

const createTwitterPrompt = (content: string): string => {
  return `
Create a Twitter post from these completed tasks. Must be 280 characters or less.

Tasks:
${content}

Requirements:
- MAXIMUM 280 characters
- Include relevant emojis
- Professional but approachable tone
- Engaging for followers

Tweet:`;
};

const createThreadPrompt = (content: string): string => {
  return `
Create a comprehensive Twitter thread from today's accomplished tasks. Break down complex topics into multiple tweets that can be as long as needed.

Tasks completed today:
${content}

Requirements:
- Each tweet MAXIMUM 280 characters
- First tweet: Engaging summary of main achievements
- Continue with as many tweets as needed to cover all details
- Number each tweet (1/n, 2/n, etc.) - n can be any number needed
- Include relevant emojis
- Professional but approachable tone
- Natural flow between tweets
- Don't rush - take space to explain properly
- Group related topics together in consecutive tweets

Format your response as:
Tweet 1: [engaging summary]
Tweet 2: [first detailed topic]
Tweet 3: [continuation or next topic]
Tweet 4: [more details]
...
Tweet N: [conclusion/final thoughts]

Create as many tweets as needed to fully cover the content. Thread:`;
};

const parseThreadResponse = (threadText: string): string[] => {
  try {
    const tweets: string[] = [];
    const lines = threadText.split('\n');
    
    for (const line of lines) {
      const tweetMatch = line.match(/^Tweet \d+:\s*(.+)$/);
      if (tweetMatch) {
        const tweetContent = tweetMatch[1].trim();
        if (tweetContent) {
          if (tweetContent.length > 280) {
            logger.warn(`Tweet ${tweets.length + 1} is ${tweetContent.length} chars, will be truncated`);
            tweets.push(tweetContent.substring(0, 280));
          } else {
            tweets.push(tweetContent);
          }
        }
      }
    }

    if (tweets.length === 0) {
      const fallbackTweets = threadText
        .split(/\d+\/\d+/)
        .map(tweet => tweet.trim())
        .filter(tweet => tweet.length > 0)
        .map(tweet => tweet.length > 280 ? tweet.substring(0, 280) : tweet);
      
      tweets.push(...fallbackTweets);
    }

    if (tweets.length === 0) {
      const chunks = [];
      const words = threadText.trim().split(' ');
      let currentChunk = '';
      
      for (const word of words) {
        if ((currentChunk + ' ' + word).length > 280) {
          if (currentChunk) {
            chunks.push(currentChunk.trim());
            currentChunk = word;
          } else {
            chunks.push(word.substring(0, 280));
          }
        } else {
          currentChunk += (currentChunk ? ' ' : '') + word;
        }
      }
      
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      
      tweets.push(...chunks);
    }

    const numberedTweets = tweets.map((tweet, index) => {
      const tweetNumber = `${index + 1}/${tweets.length}`;
      if (!tweet.includes(`${index + 1}/`)) {
        const availableSpace = 280 - tweetNumber.length - 1;
        const tweetContent = tweet.length > availableSpace ? tweet.substring(0, availableSpace) : tweet;
        return `${tweetNumber} ${tweetContent}`;
      }
      return tweet;
    });

    return numberedTweets.filter(tweet => tweet.trim().length > 0);

  } catch (error) {
    logger.error('Error parsing thread response', { error });
    return [threadText.substring(0, 280)];
  }
};