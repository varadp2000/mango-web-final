<template>
    <div class="myself-message-body">
        <div class="message-content">
            <template v-if="message.type == 'image'">
                <p class="message-username-image">{{myself.name}}</p>
                <div class="message-image" v-if="message.uploaded">
                    <img :src="message.src" @click="onImageClicked(message)" alt="" class="message-image-display">
                </div>
                <div class="message-image" v-else>
                    <img :src="message.preview" alt="" class="message-image-display img-overlay">
                    <div class="img-loading"></div>
                </div>
            </template>
            <template v-else>
                <div :style="{background: colors.message.myself.bg, color: colors.message.myself.text}"
                     class="message-text">
                    <p class="message-username">{{myself.name}}</p>
                    <span>{{message.content}}
                        <v-btn v-if="message.src" text
                               icon color="red lighten-2"
                               :href="message.src" target="_blank">
                            <v-icon>mdi-download-circle-outline</v-icon>
                        </v-btn>
                        <v-avatar
                                class="profile"
                                color="grey"
                                size="120"
                                tile
                                v-if="message.isStatus">
                            <v-img :src="message.status_link" v-if="!message.isStatusText"/>
                            <span class="white--text headline" v-else>{{message.status_link}}</span>
                        </v-avatar>
                    </span>
                </div>
            </template>
            <div class="message-timestamp" :style="{'justify-content': 'flex-end'}">
                <template v-if="timestampConfig.relative">
                    {{message.timestamp.toRelative()}}
                </template>
                <template v-else>
                    {{message.timestamp.toFormat(timestampConfig.format)}}
                </template>
                <CheckIcon v-if="asyncMode && message.uploaded && !message.viewed" :size="14" class="icon-sent"/>
                <CheckAll v-else-if="asyncMode && message.uploaded && message.viewed" :size="14"
                          class="icon-sent viewed"/>
                <div v-else-if="asyncMode" class="message-loading"></div>
            </div>
        </div>
        <div v-if="profilePictureConfig.myself" class="thum-container">
            <img class="participant-thumb" :src="myself.profilePicture"
                 :style="{'width': profilePictureConfig.styles.width, 'height': profilePictureConfig.styles.height, 'border-radius': profilePictureConfig.styles.borderRadius}">
        </div>
    </div>
</template>

<script>
    import CheckIcon from 'vue-material-design-icons/Check';
    import CheckAll from 'vue-material-design-icons/CheckAll';
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        components: {
            CheckIcon,
            CheckAll,
        },
        props: {
            message: {
                type: Object,
                required: true
            },
            asyncMode: {
                type: Boolean,
                required: false,
                default: false
            },
            colors: {
                type: Object,
                required: true
            },
            /* onImageClicked: {
                type: Function,
                required: false,
                default: null
            }, */
            profilePictureConfig: {
                type: Object,
                required: true
            },
            timestampConfig: {
                type: Object,
                required: true
            }
        },
        computed: {
            ...mapGetters([
                'getParticipantById',
                'messages',
                'myself'
            ]),
        },
        methods: {
            onImageClicked: function (message) {
                this.$emit("onImageClicked", message)
            }
        }
    }
</script>

<style lang="less">
    .container-message-display .myself-message-body {
        display: flex;
        align-items: flex-end;
        padding-right: 10px;
        justify-content: flex-end;


        .message-content {
            display: flex;
            align-items: flex-end;
            justify-content: flex-start;
            flex-direction: column;
        }

        .participant-thumb {
            width: 25px;
            height: 25px;
            border-radius: 50%;
            margin-left: 10px;
        }

        .message-timestamp {
            padding: 2px 7px;
            border-radius: 15px;
            margin: 0;
            max-width: 50%;
            overflow-wrap: break-word;
            text-align: left;
            font-size: 10px;
            color: #bdb8b8;
            width: 100%;
            display: flex;
            align-items: center;
        }

        .message-text {
            background: #fff;
            padding: 6px 10px;
            line-height: 14px;
            margin: 5px 0 5px 0;
            max-width: 70%;
            overflow-wrap: break-word;
            text-align: left;
            white-space: pre-wrap;
            border-radius: 15px 15px 0px 15px;
            word-break: break-word;
        }
    }
</style>
