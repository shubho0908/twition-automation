import { TwitterApi } from 'twitter-api-v2';
import logger from '../utils/logger';
import { handleError } from '../utils/errorHandler';
import type { TwitterContent, PostResult, TweetOptions } from '../types';

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
});

const rwClient = twitterClient.readWrite;

export const postTwitterContent = async (content: TwitterContent): Promise<PostResult> => {
  try {
    logger.info('Posting to Twitter', { type: content.type });

    if (content.type === 'single') {
      return await postSingleTweet(content.content as string);
    } else if (content.type === 'thread') {
      return await postThread(content.content as string[]);
    }

    throw new Error('Invalid content type');

  } catch (error) {
    await handleError(error as Error, 'postTwitterContent');
    return {
      success: false,
      tweetIds: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

const postSingleTweet = async (tweetText: string): Promise<PostResult> => {
  try {
    logger.info('Posting single tweet', { length: tweetText.length });

    if (tweetText.length > 280) {
      throw new Error(`Tweet too long: ${tweetText.length} characters`);
    }

    const tweet = await rwClient.v2.tweet(tweetText);
    
    logger.info('Single tweet posted successfully', { 
      tweetId: tweet.data.id,
      text: tweetText.substring(0, 50) + '...'
    });

    return {
      success: true,
      tweetIds: [tweet.data.id]
    };

  } catch (error) {
    await handleError(error as Error, 'postSingleTweet');
    return {
      success: false,
      tweetIds: [],
      error: error instanceof Error ? error.message : 'Failed to post single tweet'
    };
  }
};

const postThread = async (tweets: string[]): Promise<PostResult> => {
  logger.info('Posting Twitter thread', { tweetCount: tweets.length });

  if (tweets.length === 0) {
    throw new Error('Cannot post empty thread - no tweets provided');
  }

  for (let i = 0; i < tweets.length; i++) {
    const tweet = tweets[i];
    if (tweet.length > 280) {
      throw new Error(`Tweet ${i + 1} exceeds 280 character limit: ${tweet.length} characters - "${tweet.substring(0, 50)}..."`);
    }
  }

  const tweetIds: string[] = [];
  let replyToId: string | undefined;

  try {
    for (let i = 0; i < tweets.length; i++) {
      const tweetText = tweets[i];
      
      logger.info(`Posting tweet ${i + 1}/${tweets.length}`, { 
        tweetNumber: i + 1,
        replyToId: replyToId || 'none',
        text: tweetText.substring(0, 50) + '...',
        length: tweetText.length
      });

      const tweetOptions: TweetOptions = {
        text: tweetText
      };

      if (replyToId) {
        tweetOptions.reply = {
          in_reply_to_tweet_id: replyToId
        };
      }

      try {
        const tweet = await rwClient.v2.tweet(tweetOptions);
        tweetIds.push(tweet.data.id);
        replyToId = tweet.data.id;
        
        logger.info(`Tweet ${i + 1}/${tweets.length} posted successfully`, {
          tweetId: tweet.data.id
        });
      } catch (tweetError) {
        throw new Error(`Failed to post tweet ${i + 1}/${tweets.length}: ${tweetError instanceof Error ? tweetError.message : 'Unknown error'}. Posted ${tweetIds.length} tweets before failure.`);
      }

      if (i < tweets.length - 1) {
        logger.info(`Waiting 2 seconds before posting next tweet...`);
        await delay(2000);
      }
    }

    logger.info('Thread posted successfully', { 
      tweetCount: tweets.length,
      tweetIds: tweetIds
    });

    return {
      success: true,
      tweetIds: tweetIds
    };

  } catch (error) {
    await handleError(error as Error, 'postThread');
    throw error;
  }
};

const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const verifyTwitterConnection = async (): Promise<boolean> => {
  try {
    logger.info('Verifying Twitter connection');
    
    const user = await rwClient.v2.me();
    
    logger.info('Twitter connection verified', { 
      userId: user.data.id,
      username: user.data.username 
    });
    
    return true;

  } catch (error) {
    await handleError(error as Error, 'verifyTwitterConnection');
    return false;
  }
};

export const getRateLimitStatus = async () => {
  try {
    const rateLimitStatus = await twitterClient.v1.rateLimitStatuses();
    
    const relevantEndpoints = {
      tweets: rateLimitStatus.resources.statuses?.['/statuses/update'],
      user_timeline: rateLimitStatus.resources.statuses?.['/statuses/user_timeline'],
      verify_credentials: rateLimitStatus.resources.account?.['/account/verify_credentials']
    };

    logger.info('Rate limit status retrieved', { endpoints: relevantEndpoints });
    
    return relevantEndpoints;

  } catch (error) {
    await handleError(error as Error, 'getRateLimitStatus');
    return null;
  }
};