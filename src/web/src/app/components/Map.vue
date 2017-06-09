<template>
  <gmap-map
    :center="center"
    :zoom="12"
  >
    <gmap-marker
      :key="index"
      v-for="(m, index) in markers"
      :position="m.position"
      :clickable="true"
      :draggable="true"
      @click="center=m.position"
    ></gmap-marker>
  </gmap-map>
</template>
 
<script>
  import * as VueGoogleMaps from 'vue2-google-maps';
  import Vue from 'vue';
 
  Vue.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyDo5Ld8Zr7Gn_2QoqC-ZqvsZanwTZAVVes'
    }
  });
 
  export default {
    created() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(({coords}) => {
          this.center.lat = coords.latitude;
          this.center.lng = coords.longitude;
        });
      } else {
        console.error("Geolocation is not supported by this browser.");
      }      
      
      this.refreshInterval = setInterval(() => this.refreshData(), 5000)
    },
    methods: {
      refreshData() {
        this.$http.get('calls').then(response => {
          // console.log(response);
          this.markers = response.body.map(caller => {
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
        })
      }
    },
    data () {
      return {
        refreshInterval: null,

        center: {lat: 10.0, lng: 10.0},
        markers: [
          {
            position: {lat: 10.0, lng: 10.0}
          }, {
            position: {lat: 11.0, lng: 11.0}
          }
        ]
      }
    }
  }
</script>