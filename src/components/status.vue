<template>
  <div>
    <v-app-bar color="primary" dark>
      <h1>Status</h1>
      <v-spacer />
      <v-btn style="font-size:20px" text
        ><v-icon>mdi-plus-circle</v-icon></v-btn
      >
    </v-app-bar>
    <div style="display:flex">
      <v-list subheader style="width:20%">
        <v-subheader></v-subheader>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          @click="show = true"
        >
          <v-list-item-avatar>
            <v-img style="border:solid;z-index:2" :src="item.avatar"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div v-show="show" style="width:80%;display:flex;margin-top:10px">
        <v-carousel>
          <v-carousel-item
            v-for="(item, i) in imgs"
            :key="i"
            :src="item.src"
            reverse-transition="fade-transition"
            transition="fade-transition"
          ></v-carousel-item>
        </v-carousel>
        <v-btn @click="show = false" text> X </v-btn>
      </div>
    </div>
    <v-divider />
  </div>
</template>

<script>
export default {
  data: () => ({
    show: false,
    items: [
      {
        title: "Jason Oner",
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
      },
      {
        title: "Ranee Carlson",
        avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
      },
      {
        title: "Cindy Baker",
        avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
      },
      {
        title: "Ali Connors",
        avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
      },
      {
        title: "Travis Howard",
        avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
      },
    ],
    imgs: [
      {
        src: "https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg",
      },
      {
        src: "https://cdn.vuetifyjs.com/images/carousel/sky.jpg",
      },
      {
        src: "https://cdn.vuetifyjs.com/images/carousel/bird.jpg",
      },
      {
        src: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg",
      },
    ],
  }),
  mounted: function() {
    window.setInterval(function() {
      this.show = false;
    }, 1000);
  },
};
</script>

<style>
.top-right {
  position: absolute;
  top: 8px;
  right: 16px;
}
</style>
