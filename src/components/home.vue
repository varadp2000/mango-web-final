<template>
    <div class="chat-container">
        <Chat v-if="visible"
              :participants="participants"
              :myself="myself"
              :messages="messages"
              :chat-title="chatTitle"
              :placeholder="placeholder"
              :colors="colors"
              :border-style="borderStyle"
              :hide-close-button="hideCloseButton"
              :close-button-icon-size="closeButtonIconSize"
              :submit-icon-size="submitIconSize"
              :submit-image-icon-size="submitImageIconSize"
              :load-more-messages="toLoad.length > 0 ? loadMoreMessages : null"
              :async-mode="asyncMode"
              :scroll-bottom="scrollBottom"
              :display-header="true"
              :send-images="true"
              :profile-picture-config="profilePictureConfig"
              :timestamp-config="timestampConfig"
              @onImageClicked="onImageClicked"
              @onImageSelected="onImageSelected"
              @onMessageSubmit="onMessageSubmit"
              @onType="onType"
              @onClose="onClose('param value')">
            <template v-slot:header>
                <div>
                    <v-list style="background-color: #d30303">
                        <v-list-item v-for="(participant, index) in participants" :key="index" class="custom-title">
                            <v-list-item-avatar>
                                <v-img :src="participant.profilePicture"/>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title class="white--text font-weight-black" v-text="participant.name"/>
                            </v-list-item-content>

                            <!--                            <v-list-item-icon>-->
                            <!--                            </v-list-item-icon>-->
                        </v-list-item>
                    </v-list>
                </div>
            </template>
        </Chat>
    </div>
</template>

<script>
    import Chat from './Chat.vue'
    import db from "../firebase/firebaseInit";
    import firebase from "firebase";

    export default {
        components: {
            Chat
        },
        props: {
            id: {
                type: String,
                required: true,
            },
            participantConfig: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                visible: true,
                participants: [
                    {
                        name: 'Prabhat',
                        id: 9003397437,
                        profilePicture: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a1/NafSadh_Profile.jpg/768px-NafSadh_Profile.jpg'
                    },
                ],
                myself: {
                    name: 'Anmol',
                    id: 9389857956,
                    profilePicture: 'https://lh3.googleusercontent.com/-G1d4-a7d_TY/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJPez_wX5UCJztzEUeCxOd7HBK7-jA.CMID/s83-c/photo.jpg'
                },
                messages: [],
                chatTitle: 'My chat title',
                placeholder: 'send your message',
                colors: {
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
                },
                borderStyle: {
                    topLeft: "10px",
                    topRight: "10px",
                    bottomLeft: "10px",
                    bottomRight: "10px",
                },
                hideCloseButton: true,
                submitIconSize: 24,
                submitImageIconSize: 24,
                closeButtonIconSize: "20px",
                asyncMode: true,
                toLoad: [],
                scrollBottom: {
                    messageSent: true,
                    messageReceived: false
                },
                profilePictureConfig: {
                    others: true,
                    myself: true,
                    styles: {
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%'
                    }
                },
                timestampConfig: {
                    format: 'HH:mm',
                    relative: false
                }
            }
        },
        watch: {
            // async messages(val) {
            //     this.loading = false;
            //     try {
            //         await db
            //             .ref(`messages/90033974379389857956`)
            //             .on("value", (snapshot) => (console.log(snapshot.val())));
            //         //this.chat = this.messages.chat;
            //     } catch (err) {
            //         this.loading = false;
            //     } finally {
            //         this.loading = true;
            //     }
            // },
            // async id(val) {
            //     this.receiver = val.phone_number;
            //     this.loading = false;
            //     try {
            //         await db
            //             .ref(`messages/90033974379389857956`)
            //             .on("value", (snapshot) => (console.log(snapshot.val())));
            //         //this.chat = this.messages.chat;
            //     } catch (err) {
            //         this.loading = false;
            //     } finally {
            //         this.loading = true;
            //     }
            // },
        },
        async created() {
            try {
                await db
                    .ref(`messages/90033974379389857956`)
                    .on("value", (snapshot) => (this.cleanChat(snapshot.val())));
                //this.chat = this.messages.chat;
            } catch (err) {
                this.loading = false;
            } finally {
                this.loading = true;
            }
        },
        methods: {
            cleanChat: function (firebaseJson) {
                console.log(firebaseJson);
                let chat = firebaseJson.chat;
                var message = [];
                Object.keys(chat).forEach(function (key) {
                    let obj = {};
                    var d = new Date(parseInt(chat[key].time_stamp));
                    if (chat[key].type === 'document') {
                        var fileExt = chat[key].text.split('.').pop();
                        obj = {
                            content: chat[key].text,
                            participantId: parseInt(chat[key].sender_id),
                            timestamp: {
                                year: d.getFullYear(),
                                month: d.getMonth() + 1,
                                day: d.getDate(),
                                hour: d.getHours(),
                                minute: d.getMinutes(),
                                second: d.getSeconds(),
                                millisecond: d.getMilliseconds()
                            },
                            uploaded: true,
                            viewed: true,
                            preview: 'blob:' + chat[key].document_link,
                            src: chat[key].document_link,
                            type: 'image'
                        };
                    } else {
                        obj = {
                            content: chat[key].text,
                            participantId: parseInt(chat[key].sender_id),
                            timestamp: {
                                year: d.getFullYear(),
                                month: d.getMonth() + 1,
                                day: d.getDate(),
                                hour: d.getHours(),
                                minute: d.getMinutes(),
                                second: d.getSeconds(),
                                millisecond: d.getMilliseconds()
                            },
                            uploaded: true,
                            viewed: true,
                            type: 'text'
                        };

                    }
                    message.push(obj);
                });
                console.log(message);
                this.messages = message;
            },
            // eslint-disable-next-line
            onType: function (e) {
                // eslint-disable-next-line
                console.log('typing');
            },
            loadMoreMessages(resolve) {
                setTimeout(() => {
                    resolve(this.toLoad);
                    //Make sure the loaded messages are also added to our local messages copy or they will be lost
                    this.messages.unshift(...this.toLoad);
                    this.toLoad = [];
                }, 1000);
            },
            onMessageSubmit(message) {
                /*
                * example simulating an upload callback.
                * It's important to notice that even when your message wasn't send
                * yet to the server you have to add the message into the array
                */
                this.messages.push(message);
                var text = message.content;
                text = text.replace("\r\n", "").replace("\r", "").replace("\n", "");
                var date = new Date(message.timestamp).getTime();
                db.ref(`messages/90033974379389857956/chat`).push({
                    is_blocked: "0",
                    sender_id: message.participantId.toString(),
                    text: text,
                    time_stamp: date.toString(),
                });
                //this.message = "";
                /*
                * you can update message state after the server response
                */
                // timeout simulating the request
                setTimeout(() => {
                    message.uploaded = true
                    message.viewed = true
                }, 2000)
            },
            onClose(param) {
                console.log(param)
                this.visible = false;
            },
            onImageSelected({file, message}) {
                let src = 'https://149364066.v2.pressablecdn.com/wp-content/uploads/2017/03/vue.jpg'
                this.messages.push(message);
                console.log(message);
                var date = new Date(message.timestamp).getTime();
                db.ref(`messages/90033974379389857956/chat`).push({
                    is_blocked: "0",
                    document_link: src,
                    type: "document",
                    sender_id: message.participantId.toString(),
                    text: message.content,
                    time_stamp: date.toString(),
                });
                /**
                 * This timeout simulates a requisition that uploads the image file to the server.
                 * It's up to you implement the request and deal with the response in order to
                 * update the message status and the message URL
                 */
                setTimeout((res) => {
                    message.uploaded = true
                    message.src = res.src
                }, 3000, {src});
            },
            onImageClicked(message) {
                /**
                 * This is the callback function that is going to be executed when some image is clicked.
                 * You can add your code here to do whatever you need with the image clicked. A common situation is to display the image clicked in full screen.
                 */
                console.log('Image clicked', message.src)
            }
        },
    }
</script>

<style>
    .chat-container {
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgb(247, 243, 243);
        padding: 10px 0 10px 0;
        height: 700px;
        max-width: 80%;
    }

</style>
