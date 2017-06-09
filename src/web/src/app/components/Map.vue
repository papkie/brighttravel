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
    props: ['markers'],
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
        center: {lat: 54.3855788, lng: 18.6163662},
      }
    }
  }
</script>