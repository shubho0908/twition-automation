import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger';
import { handleError } from '../utils/errorHandler';
import type { NotionTask, TwitterContent } from '../types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

export const createTwitterPost = async (tasks: NotionTask[]): Promise<TwitterContent> => {
  try {
    logger.info('Creating Twitter post from tasks', { taskCount: tasks.length });

    const combinedContent = tasks.map(task => 
      `${task.title}\n${task.content}`
    ).join('\n\n');

    const contentLength = combinedContent.length;
    logger.info(`Combined content length: ${contentLength} characters`);

    if (contentLength <= 265) {
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

    if (tweetText.length > 265) {
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
You're Shubhojeet sharing your dev day. Summarize what you built/learned into one casual tweet.

What happened today:
${content}

Write like you're genuinely excited to share with fellow builders:
- MAXIMUM 265 characters (count carefully!)
- Personal tone ("I spent the day", "Finally cracked", "Been experimenting with")
- Show the learning journey ("learned that...", "discovered...", "turns out...")
- Include some personality ("this was fun", "pretty neat", "way cooler than expected")
- Mention specific tech but keep it conversational
- Share both wins AND small struggles
- Sound like a human, not a press release
- Hashtags are optional - only add them if they genuinely add value (max 2 if used)
- Most of the time, skip hashtags - let the content speak for itself
- NO jokes, sarcasm, or humor
- Be direct and factual
- Only include information from the provided content

Just the tweet text:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const tweetText = response.text().trim();

    if (tweetText.length > 265) {
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
You're Shubhojeet, a curious developer who loves building and learning. Write a casual tweet about what you got done today. Keep it real and personal.

What you worked on:
${content}

Write like you're texting a friend who codes:
- MAXIMUM 265 characters
- Use "I" - make it personal ("I finally got", "Just shipped", "Been diving into")
- Show your curiosity ("found out that...", "turns out...", "discovered")
- Be excited about the tech ("this is actually pretty cool", "loving how...")
- Include small struggles/wins ("took me forever but...", "way easier than I thought")
- Use casual language, not corporate speak
- Throw in some genuine enthusiasm
- Hashtags are optional - only add if really needed for context (max 2 if you do)
- Don't force hashtags - the content should be clear without them
- NO jokes, sarcasm, or humor
- Be direct and factual
- Only include information from the provided content

Tweet:`;
};

const createThreadPrompt = (content: string): string => {
  return `
You're Shubhojeet sharing your coding journey with the dev community. Write a thread about what you built/learned today. Keep it real and conversational.

What you worked on:
${content}

Write like you're genuinely excited to share your progress with fellow builders:

- MAXIMUM 5 tweets but prefer fewer if content fits well (2-4 tweets is often better)
- Each tweet max 265 characters
- Tweet 1: Set the scene naturally ("Been working on...", "So I decided to rebuild...", "Spent the day diving into...")
- Middle tweets: Share the interesting bits with ">" bullets, but make it feel like you're explaining to a friend
- Final tweet: What you actually learned/discovered ("Honestly learned so much", "This whole thing taught me...")

Sound human:
- Use "I" constantly - make it personal
- Show curiosity ("wanted to figure out...", "was curious about...")
- Include small struggles ("took me way longer than expected", "finally got it working")
- Be excited about discoveries ("turns out...", "discovered that...", "this is actually pretty cool")
- Use casual language ("pretty neat", "way better", "honestly")
- Show ambition ("next I want to...", "planning to...")
- Hashtags are completely optional - only use if they genuinely help (max 2 for entire thread)
- Most threads don't need hashtags - focus on authentic storytelling instead
- NO jokes, sarcasm, or humor
- Be direct and factual
- Only include information from the provided content

Format as 2-5 tweets (use only what's needed):
Tweet 1: [natural story opener]
Tweet 2: [cool technical stuff with > bullets]
Tweet 3: [more implementations with > bullets - only if needed]
Tweet 4: [additional discoveries with > bullets - only if needed]  
Tweet 5: [genuine reflection on what you learned - only if you have 4+ tweets]

Thread:`;
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
          if (tweetContent.length > 265) {
            logger.warn(`Tweet ${tweets.length + 1} is ${tweetContent.length} chars, will be truncated`);
            tweets.push(tweetContent.substring(0, 265));
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
        .map(tweet => tweet.length > 265 ? tweet.substring(0, 265) : tweet);
      
      tweets.push(...fallbackTweets);
    }

    if (tweets.length === 0) {
      const chunks = [];
      const words = threadText.trim().split(' ');
      let currentChunk = '';
      
      for (const word of words) {
        if ((currentChunk + ' ' + word).length > 265) {
          if (currentChunk) {
            chunks.push(currentChunk.trim());
            currentChunk = word;
          } else {
            chunks.push(word.substring(0, 265));
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

    // Limit to maximum 5 tweets
    const limitedTweets = tweets.slice(0, 5);
    
    const numberedTweets = limitedTweets.map((tweet, index) => {
      const tweetNumber = `${index + 1}/${limitedTweets.length}`;
      if (!tweet.includes(`${index + 1}/`)) {
        const availableSpace = 265 - tweetNumber.length - 1;
        const tweetContent = tweet.length > availableSpace ? tweet.substring(0, availableSpace) : tweet;
        return `${tweetNumber} ${tweetContent}`;
      }
      return tweet;
    });

    return numberedTweets.filter(tweet => tweet.trim().length > 0);

  } catch (error) {
    logger.error('Error parsing thread response', { error });
    return [threadText.substring(0, 265)];
  }
};