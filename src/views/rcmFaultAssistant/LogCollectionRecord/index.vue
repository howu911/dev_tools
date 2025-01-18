<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getLogCollectionRecords, LogRecord } from "@/api/rcmFaultAssistantApi";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";

defineOptions({
  name: "LogCollectionRecord"
});

const tableData = ref<LogRecord[]>([]);
let dataTable: any = null;

// 加载数据
const loadData = async () => {
  try {
    const response = await getLogCollectionRecords({
      currentPage: 1,
      pageSize: 1000 // 获取较多数据，由DataTable处理分页
    });

    if (response.code === 200) {
      tableData.value = response.data.records;
      initDataTable();
    } else {
      ElMessage.error(response.message || "获取日志采集记录失败");
    }
  } catch (error) {
    console.error("获取日志采集记录失败:", error);
    ElMessage.error("系统错误，请稍后重试");
  }
};

// 初始化DataTable
const initDataTable = () => {
  if (dataTable) {
    dataTable.destroy();
  }

  dataTable = $("#logTable").DataTable({
    data: tableData.value,
    columns: [
      {
        data: null,
        title: "序号",
        render: (data: any, type: any, row: any, meta: any) => meta.row + 1
      },
      { data: "ip", title: "服务器IP" },
      { data: "collectionTime", title: "采集时间" },
      {
        data: "logType",
        title: "日志类型",
        render: (data: string[]) => data.join(", ")
      },
      {
        data: "status",
        title: "采集状态",
        render: (data: string) => {
          const statusMap = {
            success: '<span class="tiny-tag success">采集成功</span>',
            failed: '<span class="tiny-tag danger">采集失败</span>',
            processing: '<span class="tiny-tag warning">采集中</span>'
          };
          return statusMap[data] || "-";
        }
      },
      { data: "remark", title: "备注" },
      {
        data: null,
        title: "操作",
        render: (data: any, type: any) => {
          if (type === "display") {
            return `
              <div class="operation-buttons">
                <button class="el-button el-button--primary el-button--small view-btn">查看</button>
                <button class="el-button el-button--success el-button--small download-btn">下载</button>
                <button class="el-button el-button--danger el-button--small delete-btn">删除</button>
              </div>
            `;
          }
          return "";
        }
      }
    ],
    language: {
      sProcessing: "处理中...",
      sLengthMenu: "显示 _MENU_ 项结果",
      sZeroRecords: "没有匹配结果",
      sInfo: "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
      sInfoEmpty: "显示第 0 至 0 项结果，共 0 项",
      sInfoFiltered: "(由 _MAX_ 项结果过滤)",
      sInfoPostFix: "",
      sSearch: "搜索:",
      sUrl: "",
      sEmptyTable: "表中数据为空",
      sLoadingRecords: "载入中...",
      sInfoThousands: ",",
      oPaginate: {
        sFirst: "首页",
        sPrevious: "上页",
        sNext: "下页",
        sLast: "末页"
      },
      oAria: {
        sSortAscending: ": 以升序排列此列",
        sSortDescending: ": 以降序排列此列"
      }
    },
    pageLength: 10,
    lengthMenu: [10, 20, 50, 100],
    responsive: true,
    ordering: true,
    searching: true
  });
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="log-collection-record-wrapper">
    <el-card class="log-card">
      <template #header>
        <div class="card-header">
          <span class="title">日志采集记录</span>
        </div>
      </template>

      <div class="table-container">
        <table id="logTable" class="display" style="width: 100%" />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.log-collection-record-wrapper {
  box-sizing: border-box;
  height: calc(100vh - 40px); // 减去上下margin
  margin: 20px;
}

.log-card {
  height: 100%;

  :deep(.el-card__body) {
    box-sizing: border-box;
    height: calc(100% - 60px); // 减去header高度
    padding: 20px;
  }
}

.table-container {
  height: 100%;
  overflow: auto;

  :deep(.dataTables_wrapper) {
    padding: 0;

    .dataTables_length {
      margin-bottom: 10px;
    }

    .dataTables_filter {
      margin-bottom: 10px;
    }

    .dataTables_info {
      padding-top: 10px;
    }

    .dataTables_paginate {
      padding-top: 10px;
    }
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    font-size: 16px;
    font-weight: bold;
  }
}

:deep(.tiny-tag) {
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 4px;

  &.success {
    color: white;
    background-color: #67c23a;
  }

  &.danger {
    color: white;
    background-color: #f56c6c;
  }

  &.warning {
    color: white;
    background-color: #e6a23c;
  }
}

.operation-buttons {
  display: flex;
  gap: 8px;

  :deep(.el-button--small) {
    padding: 4px 8px;
    font-size: 12px;
  }
}
</style>
