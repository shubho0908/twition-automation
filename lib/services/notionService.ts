import { Client } from '@notionhq/client';
import logger from '../utils/logger';
import { handleError } from '../utils/errorHandler';
import type { NotionTask, NotionRichText } from '../types';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const getTodaysCompletedTasks = async (pageId?: string): Promise<NotionTask[]> => {
  try {
    let targetPageId = pageId;
    
    if (!targetPageId) {
      logger.info('No pageId provided, attempting to find today\'s page automatically');
      const foundPageId = await findTodaysPage();
      if (foundPageId) {
        targetPageId = foundPageId;
      }
    }
    
    if (!targetPageId) {
      targetPageId = process.env.NOTION_PAGE_ID!;
      logger.info('Using fallback page ID from environment');
    }
    
    logger.info('Fetching completed tasks from Notion page', { pageId: targetPageId });
    
    const tasks = await extractCompletedTodosFromPage(targetPageId);
    
    logger.info(`Found ${tasks.length} completed tasks`);
    return tasks;

  } catch (error) {
    await handleError(error as Error, 'getTodaysCompletedTasks');
    throw error;
  }
};

const findTodaysPage = async (): Promise<string | null> => {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    logger.info('Searching for today\'s page', { date: todayStr });
    
    const response = await notion.databases.query({
      database_id: process.env.NOTION_PAGE_ID!,
      filter: {
        property: 'Date',
        date: {
          equals: todayStr
        }
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending'
        }
      ],
      page_size: 1
    });

    if (response.results.length > 0 && 'id' in response.results[0]) {
      const foundPageId = response.results[0].id;
      logger.info('Found today\'s page automatically', { pageId: foundPageId });
      return foundPageId;
    }

    logger.info('No page found for today\'s date');
    return null;

  } catch (error) {
    logger.error('Error searching for today\'s page', { error });
    return null;
  }
};

const extractCompletedTodosFromPage = async (pageId: string): Promise<NotionTask[]> => {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
    });

    const tasks: NotionTask[] = [];
    let currentSection = '';

    for (const block of response.results) {
      if ('type' in block && typeof block.type === 'string') {
        const blockData = block as unknown as BlockData;
        
        if (['heading_1', 'heading_2', 'heading_3'].includes(block.type)) {
          const headingData = blockData[block.type as keyof BlockData] as { rich_text?: NotionRichText[] };
          currentSection = extractRichTextContent(headingData?.rich_text) || '';
          continue;
        }
        
        if (block.type === 'to_do' && blockData.to_do?.checked) {
          const todoText = extractRichTextContent(blockData.to_do?.rich_text);
          if (todoText.trim()) {
            tasks.push({
              id: block.id,
              title: todoText,
              content: `${currentSection}: ${todoText}`,
              completed: true,
              date: new Date().toISOString().split('T')[0]
            });
          }
        }
      }
    }

    return tasks;

  } catch (error) {
    logger.error('Error extracting completed todos from page', { pageId, error });
    throw error;
  }
};


const extractRichTextContent = (richText: NotionRichText[] | undefined): string => {
  if (!richText || !Array.isArray(richText)) return '';
  return richText.map(text => text.plain_text).join('');
};
interface BlockData {
  [blockType: string]: {
    rich_text?: NotionRichText[];
    checked?: boolean;
  };
}

