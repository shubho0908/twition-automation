// Notion-related types
export interface NotionTask {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  date: string;
}

export interface NotionPageAnalysis {
  status: 'done' | 'not-done';
  completedTasks: NotionTask[];
  incompleteTasks: NotionTask[];
  shouldGenerateTweet: boolean;
  reason: string;
}

// Rich text type for Notion API
export interface NotionRichText {
  plain_text: string;
  href?: string | null;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
  type?: string;
}

export interface NotionPageProperty {
  id: string;
  type: string;
  title?: NotionRichText[];
  rich_text?: NotionRichText[];
  checkbox?: boolean;
  date?: { start: string; end?: string | null; };
  created_time?: string;
  last_edited_time?: string;
}

// Use the actual Notion API types from @notionhq/client
export interface NotionApiPage {
  id: string;
  created_time: string;
  last_edited_time: string;
  properties: Record<string, NotionPageProperty>;
  url: string;
}

export interface NotionQueryResponse {
  results: NotionApiPage[];
  has_more: boolean;
  next_cursor?: string;
}

export interface NotionBlock {
  id: string;
  type: string;
  paragraph?: {
    rich_text: NotionRichText[];
  };
  heading_1?: {
    rich_text: NotionRichText[];
  };
  heading_2?: {
    rich_text: NotionRichText[];
  };
  heading_3?: {
    rich_text: NotionRichText[];
  };
  bulleted_list_item?: {
    rich_text: NotionRichText[];
  };
  numbered_list_item?: {
    rich_text: NotionRichText[];
  };
  to_do?: {
    rich_text: NotionRichText[];
    checked: boolean;
  };
  quote?: {
    rich_text: NotionRichText[];
  };
  code?: {
    rich_text: NotionRichText[];
    language: string;
  };
}

// Twitter-related types
export interface TwitterContent {
  type: 'single' | 'thread';
  content: string | string[];
}

export interface PostResult {
  success: boolean;
  tweetIds: string[];
  error?: string;
}

export interface TweetOptions {
  text: string;
  reply?: {
    in_reply_to_tweet_id: string;
  };
}

// Content processing types
export interface ContentAnalysis {
  totalLength: number;
  taskCount: number;
  contentType: 'single' | 'summarized' | 'thread';
  complexity: 'simple' | 'moderate' | 'complex';
}

// Error handling types
export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Email transport type
export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  priority?: 'high' | 'normal' | 'low';
  headers?: Record<string, string>;
}

export interface EmailResult {
  messageId: string;
  accepted: string[];
  rejected: string[];
}

export interface NodemailerConfig {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
}

export interface NodemailerTransporter {
  sendMail: (options: EmailOptions) => Promise<EmailResult>;
  verify: () => Promise<boolean>;
}

// Validation types
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Test result types
// Twitter rate limit types
export interface TwitterRateLimit {
  limit: number;
  remaining: number;
  reset: number;
}

export interface TwitterRateLimits {
  tweets: TwitterRateLimit | null;
  user_timeline: TwitterRateLimit | null;
  verify_credentials: TwitterRateLimit | null;
}

export interface ServiceTestResult {
  success: boolean;
  service: string;
  connected: boolean;
  message: string;
  error?: string;
  rateLimits?: TwitterRateLimits;
  taskCount?: number;
  testContent?: string;
}