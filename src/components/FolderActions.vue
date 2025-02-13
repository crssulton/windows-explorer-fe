<template>
  <div class="flex gap-1 transition-opacity">
    <button
      @click="openAddDialog"
      class="p-1 hover:bg-gray-100 rounded-md text-gray-600 hover:text-gray-900 border hover:border-gray-900"
      title="Add subfolder"
    >
      <PlusIcon class="w-4 h-4" />
    </button>

    <button
      v-if="!hideDelete"
      @click="openDeleteConfirm"
      class="p-1 hover:bg-red-50 rounded-md text-red-500 hover:text-red-900 border border-red-500 hover:border-red-900"
      title="Delete folder"
    >
      <TrashIcon class="w-4 h-4" />
    </button>
  </div>

  <FolderModal
    v-if="showModal"
    :is-open="showModal"
    :parentId="props.folder?.id"
    @refresh="emit('refresh')"
    @close="closeModal"
  />
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import FolderModal from "./FolderModal.vue";
import axios from "axios";
import { findFolder } from "../utils/findFolder";
import type { Folder } from "../types";
import { baseUrl } from "../constant";
import { PlusIcon, TrashIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
  folder?: Folder;
  hideDelete?: boolean;
}>();

const emit = defineEmits(["refresh"]);
const showModal = ref(false);

const openAddDialog = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const openDeleteConfirm = async () => {
  if (confirm(`Are you sure you want to delete "${props.folder.name}"?`)) {
    try {
      await axios.delete(`${baseUrl}/folders/${props.folder.id}`);
      emit("refresh");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete folder");
    }
  }
};
</script>
