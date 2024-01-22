# 埋点
可以收集系统捕获异常和手动上报数据、其中异常包括 unCaught 自动捕获js异常、httpError 接口异常、sourceError 静态资源加载

异常、unhandledRejection 未处理promise异常 handledRejection 已处理promise异常 caught 手动上报异常 warn 手动上报警 

告信息、info 手动上报日志信息



静态文件脚本引入

// 获取城市信息 必须引入
<script src="http://pv.sohu.com/cityjson?ie=utf-8"></script>
// 埋点引入
<script id="rebugger" useCustomField="true" silentDev="false" reportMode="onError" apikey="API-KEY"
 src="/static/js/front_rebugger.min.js" crossorigin="anonymous"></script>
 
 
 
 动态引入
 
 // 获取城市信息 必须引入
 <script src="http://pv.sohu.com/cityjson?ie=utf-8"></script>
 // 动态埋点引入
 <script type="text/javascript">
 
 function loadScript(url, apikey) {
     var script = document.createElement("script");
     script.type = "text/javascript";
     script.src = url;
     script.setAttribute("id", "rebugger");
     script.setAttribute("apikey", apikey);
     script.setAttribute("reportMode", "onError");
     document.body.appendChild(script);
 }
 
 loadScript("/static/js/front_rebugger.min.js", "API-KEY")
 </script>
