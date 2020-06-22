<template>
    <div class="container-message-manager">
        <div class="icon-send-message">
            <v-menu
                v-model="emojiMenu"
                :close-on-content-click="false"
                top offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on">
                        <v-icon>mdi-emoticon-outline</v-icon>
                    </v-btn>
                </template>

                <v-card>
                    <VEmojiPicker @select="selectEmoji"/>
                </v-card>
            </v-menu>
        </div>
        <div class="message-text-box">
            <div ref="userInput" class="message-input" :placeholder="placeholder"
                 tabIndex="0" contenteditable="true"
                 @input="handleType" @keyup.enter.exact="sendMessage"></div>
        </div>
        <div class="container-send-message icon-send-message" @click.prevent="sendMessage">
            <SendIcon :size="submitIconSize" :fill-color="colors.submitIcon"/>
        </div>
        <div v-if="sendImages" class="container-send-message icon-send-message">
            <input ref="inputImage" accept="/*" type="file" style="display: none;" @input="handleImageChange">
            <!--                        <icon :size="submitImageIconSize" :fill-color="colors.submitImageIcon"/>-->
            <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-width="5"
                offset-x>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        color="indigo"
                        icon
                        v-bind="attrs"
                        v-on="on">
                        <v-icon>mdi-paperclip</v-icon>
                    </v-btn>
                </template>

                <v-list dense>
                    <v-list-item-group v-model="item" color="primary">
                        <v-list-item
                            v-for="(item, i) in items"
                            :key="i"
                            @click="pickImage">
                            <v-list-item-icon>
                                <v-icon v-text="item.icon"/>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title v-text="item.text"/>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-menu>
        </div>
    </div>
</template>

<script>
    //import 'vue-material-design-icons/styles.css';
    import VEmojiPicker from 'v-emoji-picker';
    import {mapMutations} from 'vuex'
    import {DateTime} from "luxon";
    import SendIcon from 'vue-material-design-icons/Send';
    //import ImageIcon from 'vue-material-design-icons/Image';

    export default {
        components: {
            SendIcon,
            // ImageIcon,
            VEmojiPicker
        },
        props: {
            /* onType: {
                type: Function,
                required: false,
                default: () => false
            }, */
            /* onMessageSubmit: {
                type: Function,
                required: false,
                default: () => false
            }, */
            colors: {
                type: Object,
                required: true
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
            /* onImageSelected: {
                type: Function,
                required: false,
                default: () => false
            }, */
            sendImages: {
                type: Boolean,
                required: false,
                default: true
            }
        },
        data() {
            return {
                textInput: '',
                fav: true,
                menu: false,
                message: false,
                hints: true,
                item: 1,
                items: [
                    {text: 'Documents', icon: 'mdi-file-document-outline'},
                    {text: 'Image', icon: 'mdi-image-multiple-outline'},
                ],
                emojiMenu: false,
            }
        },
        computed: {
            myself() {
                return this.$store.state.myself;
            },
            placeholder() {
                return this.$store.state.placeholder;
            }
        },
        methods: {
            selectEmoji(emoji) {
                this.$refs.userInput.textContent = this.$refs.userInput.textContent+emoji.data;
                console.log(emoji)
            },
            ...mapMutations([
                'newMessage'
            ]),
            sendMessage(e) {
                this.textInput = this.$refs.userInput.textContent;
                this.$refs.userInput.textContent = '';

                if (this.textInput) {
                    let inputLen = this.textInput.length;
                    let inputText = this.textInput;
                    if (this.textInput[inputLen - 1] === '\n') {
                        inputText = inputText.slice(0, inputLen - 1)
                    }
                    let message = {
                        content: inputText,
                        // myself: true,
                        participantId: this.myself.id,
                        timestamp: DateTime.local(),
                        uploaded: false,
                        viewed: false,
                        type: 'text'
                    };
                    this.$emit("onMessageSubmit", message);
                    //this.onMessageSubmit(message);
                    this.newMessage(message)
                }
            },
            handleType: function (e) {
                this.$emit("onType", e);
            },
            pickImage: function () {
                this.$refs.inputImage.click()
            },
            handleImageChange: async function (e) {
                const files = e.target.files
                let message = {
                    type: 'image',
                    preview: URL.createObjectURL(files[0]),
                    src: '',
                    content: 'image',
                    participantId: this.myself.id,
                    timestamp: DateTime.local(),
                    uploaded: false,
                    viewed: false
                };
                this.$emit("onImageSelected", {file: files[0], message});
                //this.onImageSelected(files, message)
                this.newMessage(message)
            }
        }
    }
</script>

<style lang="less">
    .quick-chat-container .container-message-manager {
        height: 65px;
        background: #fff;
        display: flex;
        align-items: center;
        padding: 0 20px 0 20px;
        -webkit-box-shadow: 0px -2px 40px 0px rgba(186, 186, 186, 0.67);
        box-shadow: 0px -2px 40px 0px rgba(186, 186, 186, 0.67);

        .message-text-box {
            padding: 0 10px 0 10px;
            flex: 1;
            overflow: hidden;
        }

        .message-input {
            width: 100%;
            resize: none;
            border: none;
            outline: none;
            box-sizing: border-box;
            font-size: 15px;
            font-weight: 400;
            line-height: 1.33;
            white-space: pre-wrap;
            word-wrap: break-word;
            color: #565867;
            -webkit-font-smoothing: antialiased;
            max-height: 40px;
            bottom: 0;
            overflow: scroll;
            overflow-x: hidden;
            overflow-y: auto;
            text-align: left;
            cursor: text;
            display: inline-block;
        }

        .message-input:empty:before {
            content: attr(placeholder);
            display: block; /* For Firefox */
            filter: contrast(15%);
            outline: none;
        }

        .message-input:focus {
            outline: none;
        }

        .container-send-message {
            margin-left: 10px;
        }

        .container-send-message svg {
            -webkit-box-sizing: content-box;
            box-sizing: content-box;
        }

        .icon-send-message {
            cursor: pointer;
            opacity: 0.7;
            transition: 0.3s;
            border-radius: 11px;
            padding: 8px;
        }

        .icon-send-message:hover {
            opacity: 1;
            background: #eee;
        }
    }
</style>
