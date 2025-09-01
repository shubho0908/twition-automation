import logger from './logger';
import type { NotionTask, TwitterContent, ContentAnalysis } from '../types';

export const analyzeContent = (tasks: NotionTask[]): ContentAnalysis => {
  try {
    const combinedContent = tasks.map(task => 
      `${task.title}\n${task.content}`
    ).join('\n\n');

    const totalLength = combinedContent.length;
    const taskCount = tasks.length;

    let contentType: 'single' | 'summarized' | 'thread';
    let complexity: 'simple' | 'moderate' | 'complex';

    if (totalLength <= 280) {
      contentType = 'single';
      complexity = 'simple';
    } else if (totalLength <= 430) {
      contentType = 'summarized';
      complexity = 'moderate';
    } else {
      contentType = 'thread';
      complexity = 'complex';
    }

    logger.info('Content analysis completed', {
      totalLength,
      taskCount,
      contentType,
      complexity
    });

    return {
      totalLength,
      taskCount,
      contentType,
      complexity
    };

  } catch (error) {
    logger.error('Error analyzing content', { error });
    return {
      totalLength: 0,
      taskCount: 0,
      contentType: 'single',
      complexity: 'simple'
    };
  }
};

export const validateTwitterContent = (content: TwitterContent): boolean => {
  try {
    if (content.type === 'single') {
      const text = content.content as string;
      if (text.length > 280) {
        logger.warn('Single tweet exceeds character limit', { length: text.length });
        return false;
      }
      return true;
    }

    if (content.type === 'thread') {
      const tweets = content.content as string[];
      
      if (tweets.length === 0) {
        logger.warn('Thread has no tweets');
        return false;
      }

      for (let i = 0; i < tweets.length; i++) {
        if (tweets[i].length > 280) {
          logger.warn(`Tweet ${i + 1} exceeds character limit`, { 
            tweetIndex: i + 1, 
            length: tweets[i].length 
          });
          return false;
        }
      }

      return true;
    }

    return false;

  } catch (error) {
    logger.error('Error validating Twitter content', { error });
    return false;
  }
};

export const sanitizeContent = (content: string): string => {
  try {
    return content
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

  } catch (error) {
    logger.error('Error sanitizing content', { error });
    return content;
  }
};

export const truncateContent = (content: string, maxLength: number): string => {
  try {
    if (content.length <= maxLength) {
      return content;
    }

    const truncated = content.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + '...';
    }

    return truncated + '...';

  } catch (error) {
    logger.error('Error truncating content', { error });
    return content;
  }
};

export const extractHashtags = (content: string): string[] => {
  try {
    const hashtagRegex = /#[\w]+/g;
    const matches = content.match(hashtagRegex);
    return matches ? Array.from(new Set(matches)) : [];

  } catch (error) {
    logger.error('Error extracting hashtags', { error });
    return [];
  }
};

export const addDefaultHashtags = (content: string, hashtags: string[] = ['#productivity', '#development']): string => {
  try {
    const existingHashtags = extractHashtags(content);
    const hashtagsToAdd = hashtags.filter(tag => !existingHashtags.includes(tag));
    
    if (hashtagsToAdd.length === 0) {
      return content;
    }

    const hashtagString = hashtagsToAdd.join(' ');
    const proposedContent = `${content} ${hashtagString}`;
    
    if (proposedContent.length <= 280) {
      return proposedContent;
    }

    return content;

  } catch (error) {
    logger.error('Error adding default hashtags', { error });
    return content;
  }
};

export const formatContentForDisplay = (content: TwitterContent): string => {
  try {
    if (content.type === 'single') {
      return content.content as string;
    }

    if (content.type === 'thread') {
      const tweets = content.content as string[];
      return tweets.map((tweet, index) => 
        `Tweet ${index + 1}/${tweets.length}: ${tweet}`
      ).join('\n\n');
    }

    return '';

  } catch (error) {
    logger.error('Error formatting content for display', { error });
    return '';
  }
};