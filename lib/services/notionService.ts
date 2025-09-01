import { Client } from '@notionhq/client';
import logger from '../utils/logger';
import { handleError } from '../utils/errorHandler';
import type { NotionTask, NotionRichText } from '../types';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const analyzeNotionPage = async (pageId: string) => {
  try {
    if (!pageId) {
      throw new Error('Page ID is required. Please provide a valid Notion page ID.');
    }
    
    logger.info('Analyzing Notion page for task status and completion', { pageId });
    
    const analysis = await extractTasksAndStatus(pageId);
    
    logger.info('Page analysis completed', { 
      status: analysis.status,
      completedTasks: analysis.completedTasks.length,
      incompleteTasks: analysis.incompleteTasks.length,
      shouldGenerate: analysis.shouldGenerateTweet
    });
    
    return analysis;

  } catch (error) {
    await handleError(error as Error, 'analyzeNotionPage');
    throw error;
  }
};

export const getTodaysCompletedTasks = async (pageId: string): Promise<NotionTask[]> => {
  try {
    if (!pageId) {
      throw new Error('Page ID is required. Please provide a valid Notion page ID.');
    }
    
    logger.info('Fetching completed tasks from Notion page', { pageId });
    
    const tasks = await extractCompletedTodosFromPage(pageId);
    
    logger.info(`Found ${tasks.length} completed tasks`);
    return tasks;

  } catch (error) {
    await handleError(error as Error, 'getTodaysCompletedTasks');
    throw error;
  }
};


const extractTasksAndStatus = async (pageId: string) => {
  try {
    // First, get page properties to check for status
    const pageResponse = await notion.pages.retrieve({ page_id: pageId });
    let pageStatus: 'done' | 'not-done' = 'not-done';
    
    // Check page properties for status
    if ('properties' in pageResponse && pageResponse.properties) {
      for (const [propertyName, property] of Object.entries(pageResponse.properties)) {
        if (propertyName.toLowerCase().includes('status') && property) {
          if (property.type === 'status' && 'status' in property && property.status) {
            const statusValue = property.status.name?.toLowerCase();
            if (statusValue === 'done' || statusValue === 'complete' || statusValue === 'completed') {
              pageStatus = 'done';
            }
          } else if (property.type === 'select' && 'select' in property && property.select) {
            const selectValue = property.select.name?.toLowerCase();
            if (selectValue === 'done' || selectValue === 'complete' || selectValue === 'completed') {
              pageStatus = 'done';
            }
          }
        }
      }
    }

    // Now get the page content for tasks
    const response = await notion.blocks.children.list({
      block_id: pageId,
    });

    const completedTasks: NotionTask[] = [];
    const incompleteTasks: NotionTask[] = [];
    let currentSection = '';

    for (const block of response.results) {
      if ('type' in block && typeof block.type === 'string') {
        const blockData = block as unknown as BlockData;
        
        if (['heading_1', 'heading_2', 'heading_3'].includes(block.type)) {
          const headingData = blockData[block.type as keyof BlockData] as { rich_text?: NotionRichText[] };
          const headingText = extractRichTextContent(headingData?.rich_text) || '';
          currentSection = headingText;
          continue;
        }
        
        if (block.type === 'to_do') {
          const todoText = extractRichTextContent(blockData.to_do?.rich_text);
          if (todoText.trim()) {
            const task: NotionTask = {
              id: block.id,
              title: todoText,
              content: `${currentSection}: ${todoText}`,
              completed: blockData.to_do?.checked || false,
              date: new Date().toISOString().split('T')[0]
            };
            
            if (blockData.to_do?.checked) {
              completedTasks.push(task);
            } else {
              incompleteTasks.push(task);
            }
          }
        }
      }
    }

    const totalTasks = completedTasks.length + incompleteTasks.length;
    const allTasksCompleted = totalTasks > 0 && incompleteTasks.length === 0;
    
    let shouldGenerateTweet = false;
    let reason = '';
    
    if (pageStatus === 'done' && completedTasks.length === 0) {
      shouldGenerateTweet = false;
      reason = 'Status is done but no completed tasks found';
    } else if (pageStatus === 'done' && completedTasks.length > 0) {
      shouldGenerateTweet = true;
      reason = 'Status is done and has completed tasks';
    } else if (pageStatus === 'not-done' && incompleteTasks.length > 0) {
      shouldGenerateTweet = false;
      reason = 'Status is not done and has incomplete tasks';
    } else if (pageStatus === 'not-done' && allTasksCompleted && totalTasks > 0) {
      shouldGenerateTweet = true;
      reason = 'Status is not done but all tasks are completed';
    } else {
      shouldGenerateTweet = false;
      reason = 'No tasks found or unclear status';
    }

    return {
      status: pageStatus,
      completedTasks,
      incompleteTasks,
      shouldGenerateTweet,
      reason
    };

  } catch (error) {
    logger.error('Error analyzing Notion page', { pageId, error });
    throw error;
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

