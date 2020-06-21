<template>
    <div style="text-align:center">
        <img src="https://www.w3schools.com/howto/img_avatar.png" style="border-radius:100%;max-width:300px">
        <vue-tel-input v-model="phone"/><br>
    </div>
</template>

<script>
export default {
  data: function() {
    return {
      phone: '',
    };
  },
  methods: {
    submit: function() {
      console.log(this.phone);
    },
  },
};
</script>

<style></style>
