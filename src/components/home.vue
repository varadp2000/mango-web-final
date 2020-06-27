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
        <v-dialog
                v-model="dialog"
                max-width="500"
        >
            <v-card>
                <v-card-title class="headline">Select Contact</v-card-title>

                <v-card-text>
                    <v-list subheader>
                        <v-subheader>Recent chat</v-subheader>

                        <v-list-item
                                v-for="(item, index) in getChatList"
                                :key="item.key">
                            <v-checkbox v-model="selectedContact" :value="item"></v-checkbox>
                            <v-list-item-avatar>
                                <v-img :src="item.avatar"/>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title v-text="item.name"/>
                            </v-list-item-content>

                            <v-list-item-icon>
                            <span>{{new Date(parseInt(item.time)).toLocaleString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                            })}}</span>
                            </v-list-item-icon>
                        </v-list-item>
                    </v-list>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                            color="green darken-1"
                            text
                            @click="forwardMessage"
                    >
                        Forward
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Chat from './Chat.vue'
    import db from "../firebase/firebaseInit";
    import firebase from "firebase";
    import {mapGetters, mapMutations} from "vuex";

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
            showChat: {
                type: Boolean,
                required: false,
                default: () => {
                    return false
                }
            }
        },
        data() {
            return {
                selectedContact: [],
                dialog: false,
                visible: false,
                participants: [],
                myself: {
                    name: '',
                    id: 9389857956,
                    profilePicture: 'https://lh3.googleusercontent.com/-G1d4-a7d_TY/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJPez_wX5UCJztzEUeCxOd7HBK7-jA.CMID/s83-c/photo.jpg'
                },
                messages: [],
                chatTitle: 'My chat title',
                placeholder: 'Send your message',
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
                    topLeft: "0px",
                    topRight: "10px",
                    bottomLeft: "0px",
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
        computed: {
            ...mapGetters([
                'getChatList',
                'getSelectedMessages',
            ]),
        },
        watch: {
            selectedContact: function (newVal, oldValue) {
                console.log(newVal);
            },
            participantConfig: function (newVal, oldVal) {
                var tempArray = [];
                tempArray.push(newVal);
                this.participants = tempArray;
                this.visible = true;
                console.log('Prop changed: ', newVal, ' | was: ', oldVal)
            },
            id: async function (newVal, oldVal) {
                this.id = newVal;
                try {
                    await db
                        .ref(`messages/${newVal}`)
                        .on("value", (snapshot) => (this.cleanChat(snapshot.val())));
                    //this.chat = this.messages.chat;
                } catch (err) {
                    this.loading = false;
                } finally {
                    this.loading = true;
                }
            }
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
        beforeMount() {
            this.selectedContact = [];
        },
        mounted() {
            let num = this.$store.getters.getPhoneNumber;
            this.myself.id = parseInt(num);
        },
        async created() {

        },
        methods: {
            ...mapMutations([
                'setSelectedMessage',
                'setFlag'
            ]),
            cleanChat: function (firebaseJson) {
                let chat = firebaseJson.chat;
                var message = [];
                Object.keys(chat).forEach(function (key) {
                    let obj = {};
                    var d = new Date(parseInt(chat[key].time_stamp));
                    if (chat[key].type === 'document') {
                        let type = "image"
                        let imageExtension = ["jpg", "jpeg", "bmp", "gif", "png"];
                        var fileExt = chat[key].text.split('.').pop();
                        if (!imageExtension.includes(/[^.]+$/.exec(fileExt)[0])) {
                            type = "other"
                        }
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
                            type: type
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
                this.toLoad = message.slice(0, (message.length - 5));
                this.messages = message.slice(1).slice(-5);
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
                }, 2000);
            },
            onMessageSubmit(message) {
                /*
                * example simulating an upload callback.
                * It's important to notice that even when your message wasn't send
                * yet to the server you have to add the message into the array
                */
                this.messages.push(message);
                //this.message = "";
                /*
                * you can update message state after the server response
                */
                // timeout simulating the request
                var text = message.content;
                var date = new Date(message.timestamp).getTime();
                setTimeout(() => {
                    text = text.replace("\r\n", "").replace("\r", "").replace("\n", "");
                    db.ref(`messages/${this.id}/chat`).push({
                        is_blocked: "0",
                        sender_id: message.participantId.toString(),
                        text: text,
                        time_stamp: date.toString(),
                    });
                    message.uploaded = true;
                    message.viewed = true;
                    let senderKey_lastMessage = message.participantId + "_last_message";
                    let senderKey_lastTimeStamp = message.participantId + "_last_time_stamp";
                    let receiverKey_lastMessage = this.participants[0].id + "_last_message";
                    let receiverKey_lastTimeStamp = this.participants[0].id + "_last_time_stamp";
                    var obj = {
                        [senderKey_lastMessage]: text,
                        [senderKey_lastTimeStamp]: date.toString(),
                        [receiverKey_lastMessage]: text,
                        [receiverKey_lastTimeStamp]: date.toString(),
                    };
                    this.updateLastSettings(obj);
                }, 2000);
            },
            updateLastSettings(object, key) {
                db.ref(`messages/${key}`).update(object);
            },
            onClose(param) {
                console.log(param)
                this.dialog = true;
                //this.visible = false;
            },
            onImageSelected({file, message}) {
                let uploadValue;
                this.messages.push(message);
                const storageRef = firebase.storage().ref(`${file.name}`).put(file);
                storageRef.on(`state_changed`, snapshot => {
                        uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    }, error => {
                        console.log(error.message)
                    },
                    () => {
                        uploadValue = 100;
                        storageRef.snapshot.ref.getDownloadURL().then((url) => {
                            var date = new Date(message.timestamp).getTime();
                            db.ref(`messages/${this.id}/chat`).push({
                                is_blocked: "0",
                                document_link: url,
                                type: "document",
                                sender_id: message.participantId.toString(),
                                text: file.name,
                                time_stamp: date.toString(),
                            });
                            let senderKey_lastMessage = message.participantId + "_last_message";
                            let senderKey_lastTimeStamp = message.participantId + "_last_time_stamp";
                            let receiverKey_lastMessage = this.participants[0].id + "_last_message";
                            let receiverKey_lastTimeStamp = this.participants[0].id + "_last_time_stamp";
                            var obj = {
                                [senderKey_lastMessage]: file.name,
                                [senderKey_lastTimeStamp]: date.toString(),
                                [receiverKey_lastMessage]: file.name,
                                [receiverKey_lastTimeStamp]: date.toString(),
                            };
                            this.updateLastSettings(obj);
                        });
                    }
                );
                /**
                 * This timeout simulates a requisition that uploads the image file to the server.
                 * It's up to you implement the request and deal with the response in order to
                 * update the message status and the message URL
                 */
            },
            onImageClicked(message) {
                /**
                 * This is the callback function that is going to be executed when some image is clicked.
                 * You can add your code here to do whatever you need with the image clicked. A common situation is to display the image clicked in full screen.
                 */
                console.log('Image clicked', message.src)
            },
            forwardMessage() {
                console.warn(this.getSelectedMessages);
                this.selectedContact.forEach(contact => {
                    this.getSelectedMessages.forEach(message => {
                        setTimeout(() => {
                            var text = message.content;
                            var date = new Date().getTime();
                            text = text.replace("\r\n", "").replace("\r", "").replace("\n", "");
                            db.ref(`messages/${contact.key}/chat`).push({
                                is_blocked: "0",
                                sender_id: this.myself.id.toString(),
                                text: text,
                                time_stamp: date.toString(),
                            });
                            let senderKey_lastMessage = this.myself.id + "_last_message";
                            let senderKey_lastTimeStamp = this.myself.id + "_last_time_stamp";
                            let receiverKey_lastMessage = contact.phoneNumber + "_last_message";
                            let receiverKey_lastTimeStamp = contact.phoneNumber + "_last_time_stamp";
                            var obj = {
                                [senderKey_lastMessage]: text,
                                [senderKey_lastTimeStamp]: date.toString(),
                                [receiverKey_lastMessage]: text,
                                [receiverKey_lastTimeStamp]: date.toString(),
                            };
                            this.updateLastSettings(obj, contact.key);
                        }, 1000);
                    });
                });
                this.dialog = false;
                this.setSelectedMessage([]);
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
        height: 700px;
        max-width: 100%;
    }

</style>
