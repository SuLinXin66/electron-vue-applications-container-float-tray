<template>
  <div @contextmenu.prevent.stop="contextMenu($event)" @mousedown="mousedown($event)" class="bgc" :style="{
    backgroundImage: `url('${icon}')`,
    backgroundSize: '100% 100%'
  }">
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import HelloWorld from './components/HelloWorld.vue';
  import {TrayIconType} from "@/electron/types";
  import {RemoteEventNames} from "@/types";
  // backgroundImage: `url('${icon}')`,

  @Component({
    components: {
      HelloWorld,
    },
  })
  export default class App extends Vue {
    private trayIcon: TrayIconType | undefined;

    private icon: string = "";

    private menu!: any;

    private mousedown(e: any) {
      const remote = this.electronRemote;
      const currWindowPosition = remote.getCurrentWindow().getPosition();
      let formX = e.screenX - currWindowPosition[0];
      let formY = e.screenY - currWindowPosition[1];
      document.onmousemove = function (e) {
        remote.getCurrentWindow().setPosition((e.screenX - formX), (e.screenY - formY));
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      }
    }

    private mounted() {

      const trayIcon: TrayIconType = this.electronIpcRenderer.sendSync(RemoteEventNames.floatTrayLoading);
      this.icon = trayIcon.onlineIcons.icon128.base64Str;

      const remote = this.electronRemote;
      const {Menu, MenuItem} = remote;
      this.menu = Menu.buildFromTemplate([
        {
          label: "即时通",
          click: () => {

          }
        },
        {
          type: "separator"
        },
        {
          label: "退出",
          // icon: remote.nativeImage.createFromDataURL(trayIcon.logoutIcon.icon16.base64Str),
          click: () => {
            const resultNum = this.electronRemote.dialog.showMessageBoxSync(remote.getCurrentWindow(), {
              type: "info",
              title: "退出提醒",
              message: "退出提醒",
              cancelId: 1,
              defaultId: 1,
              buttons: ["确认", "取消"],
            });
            if (resultNum == 0) {
              remote.app.quit()
            }
          }
        }
      ]);

    }

    private contextMenu(e: any) {
      const remote = this.electronRemote;
      this.menu.popup({window: remote.getCurrentWindow()});
      document.onmousemove = null;
    }

    private created() {

      this.electronIpcRenderer.on("icon", (event, args: TrayIconType) => {
        this.trayIcon = args;
        this.icon = this.trayIcon.onlineIcons.icon128.base64Str;
        console.log(this.trayIcon);
        console.log(this.icon);
      });

      this.electronIpcRenderer.on("trayMenu", (event, args) => {
        // this.menu = Menu.buildFromTemplate(args);
      })

    }
  }
</script>

<style lang="less">
  .bgc {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: skyblue;
    cursor: pointer;
  }
</style>
