<template>
    <v-app>
        <v-main>
            <contact-list/>
        </v-main>
    </v-app>
</template>

<script>
    import contactList from "./components/contactList";

    export default {
        name: 'app',

        components: {
            contactList
        },

        data: () => ({
            //
        }),
    };
</script>
