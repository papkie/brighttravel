<template>
  <v-app id="app">
    <v-navigation-drawer permanent light>
      <v-card>
        <v-card-row class="indigo darken-1 elevation-0">
          <v-card-title>
            <span class="white--text">Awaiting calls</span>
          </v-card-title>
        </v-card-row>
      </v-card>
      <v-list>
        <!--<v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>-->
        <!--<v-divider></v-divider>-->
        <v-expansion-panel>
          <v-expansion-panel-content v-for="(call, i) in calls" :key="i">
            <div slot="header">
              {{call.user.name}}
              <v-chip class="red white--text" v-if="call.status == 'init'" >Action required</v-chip>
            </div>
            <v-card>
              <v-card-text class="grey lighten-3">
                Name: {{call.user.name}} <br>
                Status: {{call.status}}
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <!--<v-list-item v-for="item in items" :key="item">
            <v-list-tile :href="item.href" :router="item.router">
              <v-list-tile-action>
                <v-icon light v-html="item.icon"></v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.title"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>-->
      </v-list>
    </v-navigation-drawer>
    <!--<v-toolbar class="indigo">
        <v-toolbar-side-icon light @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title light>Web Panel</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn light icon @click.native.stop="openGithub()">
        <v-icon>home</v-icon>
      </v-btn>
      </v-toolbar>-->
    <main>
      <v-container fluid class="pa-0">
        <map-component :markers="markers" style="width: 100%; height: calc(100vh);"></map-component>
      </v-container>
    </main>
  </v-app>
</template>



<script type="text/babel">
  import Vue from 'vue';
  import MapComponent from './components/Map.vue'
  export default {
    created() {
      this.refreshData();
      this.refreshInterval = setInterval(() => this.refreshData(), 5000)
    },
    destroyed() {
      clearInterval(this.refreshInterval);
    },
    methods: {
      refreshData() {
        this.$http.get('calls').then(response => {
          // console.log(response);
          this.calls = response.body
          // .map(caller => {
          //   if (!caller.startLocation) {
          //     console.warn('Empty startLocation', caller);
          //     return;
          //   }
          //   return {
          //     position: {
          //       lat: caller.startLocation[1],
          //       lng: caller.startLocation[0],
          //     }
          //   }
          // }).filter(el => !!el)
        })
      }
    },
    computed: {
      markers() {
        return this.calls.map(caller => {
            if (!caller.startLocation) {
              console.warn('Empty startLocation', caller);
              return;
            }
            return {
              position: {
                lat: caller.startLocation[1],
                lng: caller.startLocation[0],
              }
            }
          }).filter(el => !!el)
      }
    },
    data() {
      return {
        calls: [],
        drawer: true,
        items: [
          // {
          //   href: 'home',
          //   router: true,
          //   title: 'Home',
          //   icon: 'home',
          // }, {
          //   href: 'examples',
          //   router: true,
          //   title: 'Example',
          //   icon: 'extension',
          // }, {
          //   href: 'about',
          //   router: true,
          //   title: 'About',
          //   icon: 'domain',
          // }
        ]
      }
    },
    components: {
      MapComponent
    }
  }

</script>

<style>
  #app {
    height: 100vh;
    width: 100vw;
  }
</style>