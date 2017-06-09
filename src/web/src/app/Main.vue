<template>
  <v-app id="app">
    <v-navigation-drawer permanent light>
      <v-card>
        <v-card-row class="indigo darken-1 elevation-0">
          <v-card-title>
            <span class="white--text">Oczekujące wezwania</span>
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
          <v-expansion-panel-content v-for="(call, i) in calls" :key="i" @click.native="showPath(call.id)">
            <div slot="header">
              {{call.user.name}}
              <v-chip class="red white--text" v-if="call.status == 'init'">Oczekuje</v-chip>
            </div>
            <v-card>
              <v-card-text class="grey lighten-3">
                <!--Imię i nazwisko: {{call.user.name}} <br>-->
                <!--Status: {{call.status}} <br>-->
                Numer telefonu: <b>{{call.user.phoneNumber}}</b> <br> Data utworzenia: <b>{{formatDate(call.createdAt)}}</b>                <br>
                <div class="text--center">
                  <v-btn dark @click.native="callAction(call.id, 'accept')">Zaakceptuj</v-btn>
                  <v-btn dark flat @click.native="callAction(call.id, 'dismiss')">Odrzuć</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-list>
    </v-navigation-drawer>
    <main>
      <v-container fluid class="pa-0">
        <map-component :markers="markers" style="width: 100%; height: calc(100vh);"></map-component>
      </v-container>
    </main>
  </v-app>
</template>


<script type="text/babel">
  import * as Sugar from 'sugar'
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
      },
      callAction(callId, action) {
        if (action === 'dismiss') {
          return this.$http.delete(`calls/${callId}`).then(response => {
            this.refreshData()
          })
        }
        return this.$http.post(`calls/${callId}/accept`).then(response => {
            this.refreshData()          
        })
      },
      showPath(callId) {
        this.$http.get(`calls/${callId}/steps`).then(response => {
          // console.log(response);
          const steps = response.body;
          console.log(steps);
          // this.calls = response.body
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
      },
      formatDate(date) {
        return Sugar.Date.format(Sugar.Date.create(date), '{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}')
      }
    },
    computed: {
      markers() {
        return this.calls.map(call => {
            if (!call.user.location) {
              console.warn('Empty location', call);
              return;
            }
            return {
              position: {
                lat: call.user.location[1],
                lng: call.user.location[0],
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