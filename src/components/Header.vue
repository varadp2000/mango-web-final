<template>
    <div :style="{ background: colors.header.bg }" class="header-container">
        <slot
                :chatTitle="chatTitle"
                :colors="colors"
                :myself="myself"
                :participants="participants"
                name="header"></slot>
        <div class="header-title" v-if="!hasHeaderSlot">
            <p :style="{ color: colors.header.text }" class="header-title-text">
                {{chatTitle}}
            </p>
            <p class="header-paticipants-text">
                <span>{{myself.name}}, </span>
                <span :key="participant.id" v-for="(participant, index) in participants">{{participant.name}}{{participants.length - index - 1 ? ", " : ""}}</span>
            </p>
        </div>
        <div class="header-exit">
            <slot name="close-button">
                <a
                        @click.prevent="onClose"
                        class="header-exit-button"
                        href="#"
                        style="float: right;">
                    <v-icon light>fa fa-share</v-icon>
                </a>
            </slot>
        </div>
    </div>
</template>

<script>
/*
 * TODO: improve support for more than 10 participants (the names list may break in some cases)
 */
export default {
  props: {
    colors: {
      type: Object,
      required: true,
    },
    borderStyle: {
      type: Object,
      required: false,
      default: () => {
        return {
          topLeft: "10px",
          topRight: "10px",
          bottomLeft: "10px",
          bottomRight: "10px",
        };
      },
    },
    hideCloseButton: {
      type: Boolean,
      required: false,
      default: false,
    },
    closeButtonIconSize: {
      type: String,
      required: false,
      default: "15px",
    },
    /* onClose: {
                type: Function,
                required: false,
                default: () => false
            } */
  },
  computed: {
    participants() {
      return this.$store.state.participants;
    },
    myself() {
      return this.$store.state.myself;
    },
    chatTitle() {
      return this.$store.state.chatTitle;
    },
    hasHeaderSlot: function() {
      return !!this.$slots["header"];
    },
  },
  methods: {
    onClose: function() {
      this.$emit("onClose");
    },
  },
};
</script>

<style lang="less">
.quick-chat-container .header-container {
  height: 71px;
  display: flex;
  padding: 0 20px 0 10px;
  align-items: center;
  -webkit-box-shadow: 0 2px 20px 2px rgba(90, 90, 90, 0.47);
  box-shadow: 0 2px 20px 2px rgba(90, 90, 90, 0.47);
  z-index: 5;

  .header-title {
    padding: 10px;
    flex: 1;
    text-align: left;
  }

  .header-title-text {
    margin-bottom: 0;
  }

  .header-paticipants-text {
    color: #e4e4e4;
    font-size: 12px;
    margin-top: 5px;
    max-height: 30px;
    overflow: hidden;
  }

  .header-exit-button {
    text-decoration: none;
    color: white;
  }

  .icon-close-chat {
    color: #fff;
    width: 100%;
  }

  .icon-close-chat:hover {
    color: rgb(238, 121, 121);
  }
}
</style>
