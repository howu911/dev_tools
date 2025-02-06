<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElTree } from "element-plus";
import type Node from "element-plus/es/components/tree/src/model/node";

defineOptions({
  name: "LogView"
});

const route = useRoute();
const ip = ref(route.params.ip as string);
const collectionTime = ref(route.params.collectionTime as string);

// 文件树数据
const treeData = ref([]);
const defaultProps = {
  children: "children",
  label: "name"
};

// 选中的文件内容
const selectedFileContent = ref("");

// 加载文件树
const loadFileTree = async () => {
  // TODO: 调用后端API获取文件树数据
  treeData.value = [
    {
      name: "系统日志",
      children: [{ name: "system.log" }, { name: "kernel.log" }]
    },
    {
      name: "应用日志",
      children: [{ name: "app.log" }, { name: "error.log" }]
    }
  ];
};

// 处理节点点击
const handleNodeClick = async (data: any, node: Node) => {
  if (!data.children) {
    // TODO: 调用后端API获取文件内容
    selectedFileContent.value = `这是 ${data.name} 的内容`;
  }
};

onMounted(() => {
  loadFileTree();
});
</script>

<template>
  <div class="log-view-container">
    <el-card class="log-card">
      <template #header>
        <div class="card-header">
          <span class="title">日志查看 - {{ ip }}</span>
          <span class="subtitle">采集时间: {{ collectionTime }}</span>
        </div>
      </template>

      <div class="content-container">
        <div class="file-tree">
          <el-tree
            :data="treeData"
            :props="defaultProps"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
        <div class="file-content">
          <pre v-if="selectedFileContent">{{ selectedFileContent }}</pre>
          <div v-else class="placeholder">请选择要查看的日志文件</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.log-view-container {
  box-sizing: border-box;
  height: calc(100vh - 40px);
  margin: 20px;
}

.log-card {
  height: 100%;

  :deep(.el-card__body) {
    height: calc(100% - 60px);
    padding: 0;
  }
}

.card-header {
  display: flex;
  gap: 20px;
  align-items: center;

  .subtitle {
    font-size: 14px;
    color: #666;
  }
}

.content-container {
  display: flex;
  height: 100%;

  .file-tree {
    width: 250px;
    padding: 20px;
    overflow: auto;
    border-right: 1px solid #dcdfe6;
  }

  .file-content {
    flex: 1;
    padding: 20px;
    overflow: auto;

    pre {
      margin: 0;
      word-wrap: break-word;
      white-space: pre-wrap;
    }

    .placeholder {
      margin-top: 100px;
      color: #909399;
      text-align: center;
    }
  }
}
</style>
