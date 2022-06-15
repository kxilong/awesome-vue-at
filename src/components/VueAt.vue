<template>
  <div ref="editor"></div>
  <el-button type="primary" style="margin-top: 20px" @click="sendComment">
    发布
  </el-button>
</template>

<script>
import api from "@/api";
import { memberList, regHttp } from "@/utils/variables.js";
import { deepClone } from "@/utils/index.js";
import { ElMessage } from "element-plus";
import Quill from "quill";
import mention from "quill-mention"; // 引入mention 组件
import "quill-mention/dist/quill.mention.min.css";

export default {
  mounted() {
    // 官网demo使用的是id(不建议用id),因为容易重复-采用ref
    new Quill(this.$refs.editor, {
      placeholder: "输入讨论内容，可通过@提醒指定人员",
      modules: {
        mention: {
          // allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/, // 匹配字母搜索
          allowedChars: /^[\u4e00-\u9fa5]*$/, //匹配中文搜索
          mentionDenotationChars: ["@"],
          positioningStrategy: "fixed",
          renderItem: (data) => {
            return `
              <div class="member-item">
                  <image src=${data.avatar} class="member-avator"/>
                  <span class="member-name">${data.value}</span>
              </div>
            `;
          },
          renderLoading: () => {
            return "Loading...";
          },
          source: (searchTerm, renderList, mentionChar) => {
            // 第一种方式：调取接口
            // this.suggestPeople(searchTerm).then((res) => {
            // renderList(res.rows);
            // });

            // 第二种方式：静态数据（方便调试）
            const cloneMemberList = deepClone(memberList).filter(
              (item) => item.value.indexOf(searchTerm) !== -1
            );
            renderList(cloneMemberList);
          },
        },
      },
    });
  },
  methods: {
    async suggestPeople() {
      const { data } = await api.get("/route/list", {
        baseURL: "/mock/",
      });
      return data;
    },
    // 发布评论
    sendComment() {
      const atUsers = this.getAts();
      const content = this.$refs.editor.innerHTML
        .replace("ql-editor", "")
        .replace("contenteditable", "a")
        .replace(regHttp, function (item) {
          // 这里识别了链接
          return "<a href='" + item + "' target='_blank'>" + item + "</a>";
        });
      const contentText = this.getContentText();
      if (contentText == "\n") {
        ElMessage.error("请输入讨论内容");
        return;
      }
      // 最终得到的content，其实是类似富文本内容，长度长，传输给后端时最好是加密处理
      this.$emit("done", {
        atUsers,
        content,
      });
      // 清空内容区文本
      this.clear();
    },
    // 获取评论区@人有哪些
    getAts() {
      let domStr = this.$refs.editor.outerHTML;
      let patt = /<span[^>]+data-id=['"]([^'"]+)['"]+/g;
      let result = [],
        temp;
      while ((temp = patt.exec(domStr)) != null) {
        result.push({ userId: temp[1] });
      }
      return result;
    },
    getContentText() {
      const text = this.$refs.editor.innerText;
      return text;
    },
    clear() {
      const element = document.getElementsByClassName("ql-editor")[0];
      element.textContent = "";
    },
  },
};
</script>

<style lang="scss">
@import "./style/quill.snow.css";
@import "./style/vueat.scss";
</style>
