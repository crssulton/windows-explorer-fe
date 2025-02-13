<template>
  <div v-if="!!parentId">
    <div class="flex items-center justify-between mb-4 border-b pb-3">
      <h2 class="text-xl font-semibold">{{ parentDetail?.name }}</h2>
      <FolderActions
        :hideDelete="true"
        :folder="parentDetail"
        @refresh="$emit('refresh')"
      />
    </div>

    <div v-if="items.length === 0" class="text-gray-400 italic">
      No subfolders in this directory
    </div>

    <div v-else class="space-y-1">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
        @click="emit('folder-selected', item)"
      >
        <span class="text-gray-400">📁</span>
        <span class="text-sm">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FolderActions from "./FolderActions.vue";
import { findFolder } from "../utils/findFolder";
import type { Folder, NestedFolder } from "../types";

const props = defineProps<{
  folders: NestedFolder[];
  items: Folder[];
  parentId: string | null;
}>();

const emit = defineEmits(["folder-selected", "refresh"]);
const parentDetail = findFolder(props.folders, props.parentId);
</script>
