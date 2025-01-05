<template>
  <div>
    <el-container>
      <el-header style="font-size: 40px; background-color: rgb(238, 241, 246)"
        >
        <el-menu
          :default-active="$route.path"
          class="el-menu-demo"
          mode="horizontal"
          router
          background-color="rgb(238, 241, 246)"
          text-color="#333"
          active-text-color="#409eff"
        >
          <el-menu-item index="/chat">对话</el-menu-item>
          <!-- <el-menu-item index="/knowledge">知识</el-menu-item>
          <el-menu-item index="/file">文件</el-menu-item> -->
          <el-button type="danger" style="float: right;margin: 10px;" @click="clearMessage()"
              >clear</el-button
            >
        </el-menu>
      </el-header>
      <!-- main -->
      <el-main ref="chatContainer">
        <div class="chat-history" >
          <div v-for="(msg, index) in chatHistory" :key="index" class="chat-message">
            <div v-if="msg.Human" class="message human-message">
              <strong>我：</strong> {{ msg.Human }}
            </div>
            <!-- <div v-else-if="msg.AI" class="message ai-message">
              <strong>AI：</strong> {{ msg.AI }}
            </div> -->
            <div v-else-if="msg.AI" class="message ai-message">
              <div style="display: flex; align-items: flex-start;">
                <strong style="margin-right: 5px;">AI：</strong>
                <div>
                  <div v-if="msg.AI.includes('--------------------')">
                    <!-- 主内容 -->
                    <span>{{ msg.AI.split('--------------------')[0] }}</span>
                    <!-- 参考资料部分 -->
                    <div style="font-size: 14px; color: gray; margin-top: 5px;">
                      {{ msg.AI.split('--------------------')[1] }}
                    </div>
                  </div>
                  <div v-else>
                    <span>{{ msg.AI }}</span>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
        
        <br>
        
      </el-main>
      <el-footer>
        <!-- 输入框区域 -->
        <div class="chat-input">
          <el-col :span="20">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2}"
              placeholder="请输入您的问题"
              @keydown.native="handleKeyDown"
              v-model="userInput">
            </el-input>
          </el-col>
          <el-col :span="1">
            <el-button type="primary" @click="sendMessage()" class="send-button" style="margin: 5px 10px;">
              <i class="el-icon-arrow-up"></i>
            </el-button>
          </el-col>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      userInput: "", // 用户输入的文本
      chatHistory: []
    };
  },
  methods: {
    async getMessage(){
      try {
        const response = await axios.get("http://localhost:8090/message");
        if (response.data && Array.isArray(response.data)) {
          this.chatHistory = response.data;
        }
      } catch (error) {
        this.$message("连接服务失败！");
      } finally {
        this.$nextTick(() => {
          this.scrollToBottom();
        })
      };
    },

    async clearMessage(){
      try {
        const response = await axios.get("http://localhost:8090/clear");
      } catch (error) {
        this.$message.error("连接服务失败！");
      } finally {
        this.$nextTick(() => {
          this.getMessage();
          this.scrollToBottom();
          this.$message.success("清除上下文成功");
        })
      };
    },

    async sendMessage(){
      if(this.userInput==""){
        return;
      }
      this.chatHistory.push({ Human: this.userInput });
      this.chatHistory.push({ AI: "正在生成回复..." });
      const payload = { prompt: this.userInput };
      this.userInput = "";
      try {
        
        // 发送POST请求到后端服务器
        const response = await axios.post("http://localhost:8090/chat", payload);

        // 替换为后端返回的历史记录列表
        if (response.data && Array.isArray(response.data)) {
          this.chatHistory = response.data; // 全量覆盖历史对话
        }
      } catch (error) {
        this.$message.error("连接服务失败！");
      } finally {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    handleKeyDown(event) {
      if (event.key === "Enter" && !event.shiftKey) {
        // 按下 Enter 键且未按下 Shift，发送消息
        event.preventDefault();
        this.sendMessage();
      }
    },
    // 滚动到底部
    scrollToBottom() {
      const container = this.$refs.chatContainer.$el;
      container.scrollTop = container.scrollHeight;
    },
  },
  mounted() {
    this.getMessage();
  },
  beforeDestroy() {
  },
};
</script>
<style>
.el-main {
  color: #333;
  text-align: center;
  height: calc(90vh - 75px);
}
.chat-message {
  margin: 10px 10px;
  text-align: left; /* 所有消息靠左对齐 */
}
.message {
  padding: 6px 10px;
  border-radius: 5px;
  display: inline-block;
  max-width: 80%;
  word-wrap: break-word;
}
.chat-input{
  margin:10px 0 10px 0;
}
.chat-message .message {
  white-space: pre-line; /* 保留换行符并折行 */
}
</style>