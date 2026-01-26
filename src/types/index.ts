export type ItemType = 'note' | 'task' | 'idea' | 'event' | 'goal' | 'project';

export type ItemStatus = 'active' | 'completed' | 'archived' | 'in_progress' | 'raw' | 'evolving';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface Item {
  id: string;
  user_id: string;
  type: ItemType;
  content: string;
  title?: string;
  status: ItemStatus;
  priority?: PriorityLevel;
  due_date?: string;
  reminder_at?: string;
  parent_id?: string;
  tags: string[];
  is_important: boolean;
  position_x: number;
  position_y: number;
  sort_order?: number;
  progress?: number;
  created_at: string;
  updated_at: string;
}

export interface Connection {
  id: string;
  user_id: string;
  source_id: string;
  target_id: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ItemTypeConfig {
  type: ItemType;
  label: string;
  icon: string;
  color: string;
  bgClass: string;
}

export const ITEM_TYPES: ItemTypeConfig[] = [
  { type: 'note', label: 'Anotação', icon: '📝', color: 'mindflow-blue', bgClass: 'badge-note' },
  { type: 'task', label: 'Tarefa', icon: '✅', color: 'mindflow-green', bgClass: 'badge-task' },
  { type: 'idea', label: 'Ideia', icon: '💡', color: 'mindflow-purple', bgClass: 'badge-idea' },
  { type: 'event', label: 'Evento', icon: '📅', color: 'mindflow-orange', bgClass: 'badge-event' },
  { type: 'goal', label: 'Objetivo', icon: '🎯', color: 'mindflow-pink', bgClass: 'badge-goal' },
  { type: 'project', label: 'Projeto', icon: '📁', color: 'mindflow-cyan', bgClass: 'badge-project' },
];

export const getItemTypeConfig = (type: ItemType): ItemTypeConfig => {
  return ITEM_TYPES.find(t => t.type === type) || ITEM_TYPES[0];
};
