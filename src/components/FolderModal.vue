<template>
  <teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Create New Folder</h3>
          <button
            @click="emit('close')"
            class="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <input
          v-model="folderName"
          ref="nameInput"
          @keyup.enter="handleCreate"
          placeholder="Folder name"
          class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
        />

        <div v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</div>

        <div class="flex justify-end gap-2">
          <button
            @click="emit('close')"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            @click="handleCreate"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import axios from "axios";
import type { Folder } from "../types";
import { baseUrl } from "../constant";

const props = defineProps<{
  isOpen: boolean;
  parentId?: string;
}>();

const emit = defineEmits(["refresh", "close"]);

const folderName = ref("");
const error = ref<string | null>(null);
const nameInput = ref<HTMLInputElement | null>(null);
const createError = ref<string | null>(null);

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      folderName.value = "";
      error.value = null;
      nextTick(() => nameInput.value?.focus());
    }
  }
);

const handleCreate = async () => {
  if (!folderName.value.trim()) {
    error.value = "Folder name cannot be empty";
    return;
  }

  try {
    await axios.post(`${baseUrl}/folders`, {
      name: folderName.value,
      parentId: props.parentId,
    });
    emit("refresh");
    emit("close");
  } catch (error) {
    error.value = error.response?.data?.message || "Failed to create folder";
  }
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
