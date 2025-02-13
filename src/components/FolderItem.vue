<template>
  <div>
    <div class="flex items-center justify-between group">
      <div
        class="flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors flex-1 ml-4 justify-between mr-2 hover:bg-gray-100"
        :style="{ paddingLeft: `${depth * 20 + 8}px` }"
      >
        <div class="flex gap-2" @click="toggle">
          <span class="text-gray-400">
            {{ isOpen ? "📂" : "📁" }}
          </span>
          <span class="truncate text-sm">{{ folder.name }}</span>
        </div>
        <FolderActions :folder="folder" @refresh="$emit('refresh')" />
      </div>
    </div>

    <div v-if="isOpen && folder.children?.length" class="ml-2">
      <FolderItem
        v-for="child in folder.children"
        :key="child.id"
        :folder="child"
        :depth="depth + 1"
        @folder-selected="$emit('folder-selected', $event)"
        @refresh="$emit('refresh')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FolderActions from "./FolderActions.vue";
import type { NestedFolder } from "../types";

const props = defineProps<{
  folder: NestedFolder;
  depth: number;
}>();

const emit = defineEmits(["folder-selected", "refresh"]);

const isOpen = ref(false);
const isSelected = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
  isSelected.value = !isSelected.value;
  emit("folder-selected", props.folder);
};
</script>
