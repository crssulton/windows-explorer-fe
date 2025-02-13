<template>
  <div class="space-y-2">
    <FolderItem
      v-for="folder in folders"
      :key="folder.id"
      :folder="folder"
      :depth="0"
      @folder-selected="$emit('folder-selected', $event)"
      @refresh="$emit('refresh')"
    />
  </div>
</template>

<script setup lang="ts">
import FolderItem from "./FolderItem.vue";
import type { NestedFolder } from "../types";

defineProps<{ folders: NestedFolder[] }>();

defineEmits(["folder-selected", "refresh"]);
</script>
