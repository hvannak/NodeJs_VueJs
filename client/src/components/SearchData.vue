<template>
  <v-app height="100%" class="mx-2 my-2">
    <v-data-iterator
      :items="allPosts"
      :items-per-page.sync="itemsPerPage"
      :page="page"
      :search="search"
      hide-default-footer
    >

      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.name"
            cols="12"
            sm="6"
            md="4"
            lg="4"
          >

            <v-hover v-slot="{ hover }" open-delay="200">
              <v-card
                class="mx-auto"
                color="grey lighten-4"
                max-width="600"
                :elevation="hover ? 16 : 2"
                :class="{ 'on-hover': hover }"
              >
                <v-img
                  :aspect-ratio="16/9"
                  :src="readBufferImg(item.image[0])"
                >
                </v-img>
                <v-card-text
                  class="pt-6"
                  style="position: relative;"
                >
                  <v-btn
                    absolute
                    color="orange"
                    class="white--text"
                    fab
                    large
                    right
                    top
                  >
                    <v-icon>mdi-chevron-double-right</v-icon>
                  </v-btn>
                  <div class="font-weight-light grey--text title mb-2">
                    For the {{item.category}}
                  </div>
                  <h3 class="display-1 font-weight-light orange--text mb-2">
                    {{item.title}}
                  </h3>
                  <div class="font-weight-light title mb-2">
                    {{item.description}}
                  </div>
                </v-card-text>
              </v-card>
            </v-hover>


            <!-- <v-card class="mx-auto my-2">
              <v-img height="250" :src="readBufferImg(item.image[0])"></v-img>

              <v-card-title>{{ item.title }}</v-card-title>

              <v-card-text>
                <v-row align="center" class="mx-0">
                  <v-rating
                    :value="4.5"
                    color="amber"
                    dense
                    half-increments
                    readonly
                    size="14"
                  ></v-rating>

                  <div class="grey--text ml-4">4.5 (413)</div>
                </v-row>

                <div class="my-4 subtitle-1">{{item.category}}</div>

                <div>
                  {{item.description}}
                </div>
              </v-card-text>

              <v-divider class="mx-4"></v-divider>

              <v-card-title>Tel: {{item.phone}}</v-card-title>

              <v-card-text> </v-card-text>

              <v-card-actions>
                <v-btn color="deep-purple lighten-2" text> VIEW </v-btn>
              </v-card-actions>
            </v-card> -->

          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <div class="text-center">
          <v-container>
            <v-row justify="center">
              <v-col cols="8">
                <v-container class="max-width">
                  <v-pagination
                    v-model="page"
                    class="my-4"
                    :length="numberOfPages"
                  ></v-pagination>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </template>
    </v-data-iterator>
  </v-app>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      search: "",
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 9,
      sortBy: "name",
      keys: [
        "Name",
        "Calories",
        "Fat",
        "Carbs",
        "Protein",
        "Sodium",
        "Calcium",
        "Iron",
      ],
    };
  },
  computed: {
    ...mapGetters(["allPosts", "getPosttotalItems"]),
    numberOfPages() {
      return this.getPosttotalItems <= 9 ? 1 : this.getPosttotalItems / 9;
    },
  },
  methods: {
    readBufferImg(image) {
      var bytes = new Uint8Array(image.data);
      var binary = bytes.reduce(
        (data, b) => (data += String.fromCharCode(b)),
        ""
      );
      return binary;
    },
  },
};
</script>
<style lang="sass" scoped>
  .v-card.on-hover.theme--dark
    background-color: rgba(#FFF, 0.8)
    >.v-card__text
      color: #000
</style>