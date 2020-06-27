<template>
    <v-container>
        <v-carousel
                :continuous="true"
                :show-arrows="false"
                cycle
                delimiter-icon="mdi-minus"
                interval="2000"

        >
            <v-carousel-item
                    :key="i"
                    v-for="(item, i) in list"
            >
                <v-sheet
                        color="f44336"
                        height="100%"
                        v-if="item.status_type ==='text' "
                >
                    <v-row
                            align="center"
                            class="fill-height"
                            justify="center"
                    >
                        <div class="display-3">{{item.status}}</div>
                    </v-row>
                </v-sheet>
                <v-img :src="'http://ec2-15-236-123-137.eu-west-3.compute.amazonaws.com'+item.status" aspect-ratio="1"
                       contain
                       height="100%" v-else
                       width="100%"></v-img>
            </v-carousel-item>
        </v-carousel>
    </v-container>
</template>

<script>
    export default {
        name: "statusDisplay",
        props: {
            list: {
                type: Array,
                required: true,
            },
        },
    }
</script>

<style scoped>

</style>
