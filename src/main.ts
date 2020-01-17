import Vue from 'vue'
import App from './App.vue'
import ElectronMatch from "@/electron/index"

import IpcRenderer = Electron.IpcRenderer;
import Remote = Electron.Remote;

Vue.use(ElectronMatch);

declare module "vue/types/vue" {

  interface Vue {
    isHaveElectron: boolean,
    electronRemote: Remote,
    electronIpcRenderer: IpcRenderer
  }
}

declare global {
  interface window {
    require: (str: string) => any,
  }
}
if (typeof WebSocket === "undefined") {
  alert("当前浏览器无法运行此程序,请更换您的浏览器");
} else {
  Vue.config.productionTip = false;
  new Vue({
    render: h => h(App),
  }).$mount('#app');
}

