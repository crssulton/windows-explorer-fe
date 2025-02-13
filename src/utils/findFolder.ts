import type { NestedFolder } from "../types";

export const findFolder = (
  folders?: NestedFolder[],
  id?: string | null
): NestedFolder | null => {
  if (!folders || !id) return null;

  for (const folder of folders) {
    if (folder.id === id) return folder;
    const found = findFolder(folder.children, id);
    if (found) return found;
  }
  return null;
};
