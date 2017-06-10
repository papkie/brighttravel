<template>
  <gmap-map
    :center="center"
    :zoom="6"
  >
    <gmap-marker
      :key="index"
      v-for="(m, index) in markers"
      :position="m.position"
      :clickable="true"
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
    props: ['markers', 'center'],
    created() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(({coords}) => {
          this.center.lat = coords.latitude;
          this.center.lng = coords.longitude;
        });
      } else {
        console.error("Geolocation is not supported by this browser.");
      }      
    },
    data () {
      return {

      }
    }
  }
</script>