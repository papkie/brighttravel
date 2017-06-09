<template>
  <v-app id="app">
      <v-navigation-drawer persistent v-model="drawer">
        <v-list>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>
                <span>Menu</span>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-item v-for="item in items" :key="item">
            <v-list-tile :href="item.href" :router="item.router">
              <v-list-tile-action>
                <v-icon light v-html="item.icon"></v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.title"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar class="indigo">
        <!--<v-toolbar-side-icon light @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>-->
        <v-toolbar-title light>Web Panel</v-toolbar-title>
        <v-spacer></v-spacer>
        <!--<v-btn light icon @click.native.stop="openGithub()">
        <v-icon>home</v-icon>
      </v-btn>-->
      </v-toolbar>
      <main>
        <v-container fluid class="pa-0">
          <map-component style="width: 100vw; height: calc(100vh - 60px);"></map-component>
        </v-container>
      </main>
  </v-app>
</template>


<script type="text/babel">
  import Vue from 'vue';
  import MapComponent from './components/Map.vue'
  export default {
    data() {
      return {
        drawer: false,
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
    methods: {
      
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