import Vue from "vue";
import Vuex from "vuex";
import { DateTime } from "luxon";

Vue.use(Vuex);

export default () => {
  return new Vuex.Store({
    state: {
      messages: [],
      myself: {},
      participants: [],
      chatTitle: "",
      placeholder: "",
      token: localStorage.getItem("auth_token") || '',
      isAuthenticated: localStorage.getItem("isAuthenticated") || false,
      phoneNumber: localStorage.getItem("phone") || null,
      e1: 1,
      countryCode: "+91",
      chatList: [],
      selectedMessages: [],
      isMessageForwarded: false,
    },
    mutations: {
      newMessage: (state, message) => {
        message.timestamp = message.timestamp.toISO();
        message.myself = message.participantId === state.myself.id;
        state.messages = [...state.messages, message];
      },
      setParticipants: (state, participants) => {
        state.participants = participants;
      },
      setMyself: (state, myself) => {
        state.myself = myself;
      },
      setMessages: (state, messages) => {
        messages.map((message) => {
          if (typeof message.timestamp == "object") {
            message.timestamp = DateTime.fromObject(message.timestamp).toISO();
          }
          if (!("myself" in message))
            message.myself = message.participantId === state.myself.id;
        });
        state.messages = messages;
      },
      setChatTitle: (state, title) => {
        state.chatTitle = title;
      },
      setPlaceholder: (state, placeholder) => {
        state.placeholder = placeholder;
      },
      setAuthToken: (state, payload) => {
        localStorage.setItem("auth_token", payload.token);
        localStorage.setItem("isAuthenticated", "true");
        state.token = payload.token;
        state.isAuthenticated = true;
      },
      setPhoneNumber: (state, payload) => {
        localStorage.setItem("phone", payload.num);
        state.phoneNumber = payload.num;
        state.countryCode = `+${payload.country}`;
      },
      setChatList: (state, payload) => {
        state.chatList = payload;
      },
      setSelectedMessage: (state, payload) => {
        state.selectedMessages = payload;
      },
      setFlag: (state, payload) => {
        state.isMessageForwarded = payload;
      },
    },
    actions: {},
    getters: {
      e1: (state) => {
        return state.e1;
      },
      getParticipantById: (state) => (id) => {
        let curr_participant;
        state.participants.forEach((participant) => {
          if (participant.id === id) {
            curr_participant = participant;
          }
        });

        return curr_participant;
      },
      messages: (state) => {
        let messages = [];
        state.messages.forEach((message) => {
          let newMessage = { ...message };
          newMessage.timestamp = DateTime.fromISO(newMessage.timestamp);
          messages.push(newMessage);
        });
        return messages;
      },
      myself: (state) => {
        return state.myself;
      },
      getAuthStatus: (state) => {
        return state.isAuthenticated;
      },
      getPhoneNumber: (state) => {
        return state.phoneNumber;
      },
      getCountryCode: (state) => {
        return state.countryCode;
      },
      getChatList: (state) => {
        return state.chatList;
      },
      getSelectedMessages: (state) => {
        return state.selectedMessages;
      },
      getFlag: (state) => {
        return state.isMessageForwarded;
      },
    },
  });
};
