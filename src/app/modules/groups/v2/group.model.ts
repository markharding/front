export interface MindsGroup {
  guid: string;
  type: string;
  name: string;
  urn: string;
  brief_description: string;
  briefdescription: string;
  icon_time: number;
  icontime: number;
  banner: number;
  banner_position: number;
  membership: number;
  moderated: number;
  default_view: number;
  featured: number;
  featured_id: null;
  tags: Array<string>;
  boost_rejection_reason: number;
  mature: boolean;
  rating: number;
  videoChatDisabled: boolean;
  conversationDisabled: boolean;
  pinned_posts: Array<any>;
  owner_guid: number;
  'members:count': number;
  'requests:count': number;
  'adminqueue:count': number;
  nsfw: Array<any>;
  nsfw_lock: Array<any>;
  'is:owner': boolean;
  'is:moderator': boolean;
  'is:member': boolean;
  'is:creator': boolean;
  'is:awaiting': boolean;
  'is:muted': boolean;
  'thumbs:up:count': number;
  'thumbs:down:count': number;
  'thumbs:up:user_guids': Array<any>;
  'thumbs:down:user_guids': Array<any>;
  'comments:count': number;
}
