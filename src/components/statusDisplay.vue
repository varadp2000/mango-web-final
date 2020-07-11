<template>
    <v-container>
        <v-carousel
                delimiter-icon="mdi-minus"
                show-arrows
                v-model="currentIndex">
            <v-carousel-item
                    :key="i"
                    v-for="(item, i) in list">
                <v-sheet
                        color="f44336"
                        height="100%"
                        v-if="item.status_type ==='text' ">
                    <v-row
                            align="center"
                            class="fill-height"
                            justify="center">
                        <div class="display-3">{{item.status}}</div>
                    </v-row>
                </v-sheet>
                <v-img :src="'http://ec2-15-236-123-137.eu-west-3.compute.amazonaws.com'+item.status" aspect-ratio="1"
                       contain
                       height="100%" v-else
                       width="100%"/>
            </v-carousel-item>
        </v-carousel>
        <div :style="{'border-bottom-left-radius': borderStyle.bottomLeft, 'border-bottom-right-radius': borderStyle.bottomRight, 'border-top-right-radius': borderStyle.topRight, 'border-top-left-radius': borderStyle.topLeft}"
             class="quick-chat-container">
            <MessageManager :border-style="borderStyle"
                            :colors="colors" :send-images="sendImages"
                            :submit-icon-size="submitIconSize"
                            :submit-image-icon-size="submitImageIconSize"
                            @onImageSelected="onImageSelected"
                            @onMessageSubmit="onMessageSubmit"
                            @onType="onType"/>
        </div>
    </v-container>
</template>

<script>
    import MessageManager from './MessageManager.vue'
    import {mapGetters, mapMutations} from "vuex";
    import db from "../firebase/firebaseInit";

    export default {
        name: "status-display",
        components: {
            MessageManager
        },
        props: {
            phoneNumber: {
                type: String,
                required: true,
            },
            list: {
                type: Array,
                required: true,
            },
            colors: {
                type: Object,
                required: false,
                default: () => {
                    return {
                        header: {
                            bg: '#d30303',
                            text: '#fff'
                        },
                        message: {
                            myself: {
                                bg: '#fff',
                                text: '#525252'
                            },
                            others: {
                                bg: '#fb4141',
                                text: '#fff'
                            },
                            messagesDisplay: {
                                //bg: 'rgb(247, 243, 243)',
                                //bg: '#f7f3f3'
                                bg: '#f7f3f3'
                            }
                        },
                        submitIcon: '#b91010',
                        submitImageIcon: '#b91010',
                    }
                }
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
                    }
                }
            },
            submitIconSize: {
                type: Number,
                required: false,
                default: 24
            },
            submitImageIconSize: {
                type: Number,
                required: false,
                default: 24
            },
            sendImages: {
                type: Boolean,
                required: false,
                default: false
            },
        },
        data: () => ({
            currentIndex: 0,
        }),
        computed: {
            currentStatus() {
                if (this.list[this.currentIndex].status_type === 'text') {
                    return this.list[this.currentIndex].status
                } else {
                    return "http://ec2-15-236-123-137.eu-west-3.compute.amazonaws.com" + this.list[this.currentIndex].status
                }
            },
            ...mapGetters({
                sender: 'getPhoneNumber',
            }),
        },
        created() {
            this.setPlaceholder("Type A reply");
        },
        methods: {
            ...mapMutations([
                'setPlaceholder',
            ]),
            onType: function (e) {
            },
            onMessageSubmit: function (message) {
                var msgKey = '';
                var receiverNumber = this.phoneNumber;
                receiverNumber = parseInt(receiverNumber.substring(3));
                if (receiverNumber > parseInt(this.sender)) {
                    msgKey = "" + parseInt(this.sender) + receiverNumber;
                } else {
                    msgKey = "" + receiverNumber + parseInt(this.sender);
                }
                console.log(msgKey);
                console.log(message);
                var text = message.content;
                var date = new Date(message.timestamp).getTime();
                setTimeout(() => {
                    text = text.replace("\r\n", "").replace("\r", "").replace("\n", "");
                    db.ref(`messages/${msgKey}/chat`).push({
                        is_blocked: "0",
                        is_status: "1",
                        status_link: this.currentStatus,
                        sender_id: message.participantId.toString(),
                        text: text,
                        time_stamp: date.toString(),
                    });
                    message.uploaded = true;
                    message.viewed = true;
                    let senderKey_lastMessage = message.participantId + "_last_message";
                    let senderKey_lastTimeStamp = message.participantId + "_last_time_stamp";
                    let receiverKey_lastMessage = receiverNumber + "_last_message";
                    let receiverKey_lastTimeStamp = receiverNumber + "_last_time_stamp";
                    var obj = {
                        [senderKey_lastMessage]: text,
                        [senderKey_lastTimeStamp]: date.toString(),
                        [receiverKey_lastMessage]: text,
                        [receiverKey_lastTimeStamp]: date.toString(),
                    };
                    this.updateLastSettings(obj, msgKey);
                }, 2000);
            },
            updateLastSettings(object, key) {
                if (key === 0) {
                    db.ref(`messages/${this.id}`).update(object);
                } else {
                    db.ref(`messages/${key}`).update(object);
                }
            },
            onImageSelected: function (data) {
            },
        }
    }
</script>

<style lang="less">
    .quick-chat-container {
        display: flex;
        width: 100%;
        height: 100%;
        background: #f0eeee;
        flex-direction: column;
        align-items: stretch;
        overflow: hidden;
    }
</style>

