export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

export interface NestedFolder extends Folder {
  children?: NestedFolder[];
}
