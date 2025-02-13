<template>
  <div class="h-screen w-screen flex bg-gray-50">
    <!-- Left Panel -->
    <div class="w-80 border-r bg-white overflow-y-auto">
      <div class="mt-6 ml-6 mr-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold">Windows Exploler</h2>
        <FolderActions :hideDelete="true" @refresh="refreshTree" />
      </div>

      <div v-if="loading" class="p-4 text-gray-500">Loading folders...</div>
      <div v-else-if="error" class="p-4 text-red-500">{{ error }}</div>
      <FolderTree
        :folders="folderTree"
        @folder-selected="handleFolderSelect"
        @refresh="refreshTree"
        class="mt-3"
      />
    </div>

    <!-- Right Panel -->
    <div class="flex-1 p-6 overflow-y-auto">
      <div v-if="currentChildrenLoading" class="text-gray-500">
        Loading contents...
      </div>
      <div v-else-if="currentChildrenError" class="text-red-500">
        {{ currentChildrenError }}
      </div>
      <FolderContents
        v-else
        :folders="folderTree"
        :items="currentChildren"
        :parentId="parentId"
        @refresh="refreshTree"
        @folder-selected="handleFolderSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import axios from "axios";
import { PlusIcon } from "@heroicons/vue/24/outline";
import FolderTree from "./components/FolderTree.vue";
import FolderContents from "./components/FolderContents.vue";
import FolderActions from "./components/FolderActions.vue";
import type { Folder, NestedFolder } from "./types";
import { baseUrl } from "./constant";
import { findFolder } from "./utils/findFolder";

const loading = ref(true);
const error = ref<string | null>(null);
const folderTree = ref<NestedFolder[]>([]);

const parentId = ref<string | null>(null);
const currentChildren = ref<Folder[]>([]);
const currentChildrenLoading = ref(false);
const currentChildrenError = ref<string | null>(null);

const refreshTree = async () => {
  loading.value = true;
  try {
    const { data } = await axios.get<NestedFolder[]>(`${baseUrl}/folders/tree`);
    folderTree.value = data;

    if (parentId.value) {
      const folder = findFolder(data, parentId.value);
      if (folder) {
        currentChildren.value = folder.children;
      }
    }
  } catch (err) {
    error.value = "Failed to load folder structure";
  } finally {
    loading.value = false;
  }
};

onMounted(refreshTree);

const handleFolderSelect = async (folder: NestedFolder) => {
  currentChildrenLoading.value = true;
  currentChildrenError.value = null;

  try {
    const { data } = await axios.get<Folder[]>(
      `${baseUrl}/folders/${folder.id}/children`
    );
    currentChildren.value = data;
    parentId.value = folder.id;
  } catch (err) {
    currentChildrenError.value = "Failed to load folder contents";
  } finally {
    currentChildrenLoading.value = false;
  }
};
</script>
