<template>
    <v-app>
        <v-main>
            <!--            <login/>-->
            <contact-list/>
        </v-main>
    </v-app>
</template>

<script>
    import contactList from "./components/contactList";
    import login from "./components/Login";

    export default {
        name: "app",

        components: {
            contactList,
            login,
        },

        data: () => ({
            //
        }),
    };
</script>
