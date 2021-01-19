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
                    @input="navigationPage"
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
import { mapGetters,mapActions } from "vuex";

export default {
  data() {
    return {
      search: "",
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 9
    };
  },
  computed: {
    ...mapGetters(["allPosts", "getPosttotalItems","getSearchObj","getCurrentPage"]),
    numberOfPages() {
      return this.getPosttotalItems <= 9 ? 1 : Math.ceil(this.getPosttotalItems / 9);
    },
  },
  created() {
    this.page = this.getCurrentPage;
  },
  methods: {
    ...mapActions(["fetchPostByCat"]),
    readBufferImg(image) {
      var bytes = new Uint8Array(image.data);
      var binary = bytes.reduce(
        (data, b) => (data += String.fromCharCode(b)),
        ""
      );
      return binary;
    },
    navigationPage(value){
      let pageObj = Object.assign({},this.getSearchObj);
      pageObj.pageOpt.page = value;
      this.$store.commit("setCurrentPage", value);
      this.fetchPostByCat(pageObj);
    }
  },
};
</script>
<style lang="sass" scoped>
  .v-card.on-hover.theme--dark
    background-color: rgba(#FFF, 0.8)
    >.v-card__text
      color: #000
</style>