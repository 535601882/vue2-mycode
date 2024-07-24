<template>
  <div></div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    /*const source = new EventSource("http://localhost:3001/sse");

      source.addEventListener('message', e => {
        console.log('RECEIVED', e.data);
      });
      source.addEventListener('stdout', e => {
        console.log('stdout RECEIVED', e.data);
      });
      // eslint-disable-next-line no-unused-vars
      source.addEventListener('open', e => {
        console.log('SSE connection established.');
      });
      source.addEventListener('error', e => {
        if (e.eventPhase === EventSource.CLOSED) {
          console.log('SSE connection closed');
        } else {
          console.log('error', e);
        }
      });*/

    // setTimeout(() => source.close(), 10000);

    // 利用fetch接收
    fetch("http://localhost:3001/sse")
      .then((response) => {
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let partialData = "";

        const readStream = () => {
          reader
            .read()
            .then(({ done, value }) => {
              if (done) {
                console.log("数据流读取完成");
                return;
              }

              partialData += decoder.decode(value, { stream: true });

              const lines = partialData.split("\n");
              partialData = lines.pop();

              lines.forEach((line) => {
                // 处理每行数据
                console.log("Received data:", line);
              });

              readStream();
            })
            .catch((error) => {
              console.error("发生错误:", error);
            });
        };

        readStream();
      })
      .catch((error) => {
        console.error("请求失败:", error);
      });
  },
};
</script>
