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
                max-width="600"
                :elevation="hover ? 16 : 2"
                :class="{ 'on-hover': hover }"
              >
                <v-container>
                    <v-img
                      :aspect-ratio="16 / 9"
                      contain
                      :src="item.firstimage"
                    >
                    </v-img>
                </v-container>
                <v-card-text class="pt-6 blue lighten-5" style="position: relative">
                  <v-btn
                    absolute
                    color="orange"
                    class="white--text"
                    fab
                    large
                    right
                    top
                    @click="showDetails(item)"
                  >
                    <v-icon>mdi-chevron-double-right</v-icon>
                  </v-btn>

                  <div class="font-weight-light grey--text title mb-2">
                    {{ item.category.title }}
                  </div>
                  <h3 class="display-1 font-weight-light orange--text mb-2">
                    {{ item.title }}
                  </h3>
                  <h5 class="display-1 font-weight-light green--text mb-2">
                    {{ item.price }}
                  </h5>
                  <div class="font-weight-light title mb-2">
                    {{ item.location }}
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

    <v-row justify="space-around">
      <v-col cols="auto">
        <v-dialog
          transition="dialog-top-transition"
          max-width="800"
          v-model="dialog"
        >
        <v-card>
          <v-toolbar
            color="primary"
            dark
          >{{showLanguage('Message_title_detail')}}</v-toolbar>
          <v-carousel>
            <v-carousel-item
              v-for="(itm,i) in getPostImages"
              :key="i"
              :src="itm.image"
              reverse-transition="fade-transition"
              transition="fade-transition"
              contain
            ></v-carousel-item>
          </v-carousel>
          <v-card-text>
          <v-timeline dense>
            <v-timeline-item
              color="purple lighten-2"
              fill-dot
              right
            >
              <v-card>
                <v-card-title class="purple lighten-2">
                  <v-icon
                    dark
                    size="42"
                    class="mr-4"
                  >
                    mdi-magnify
                  </v-icon>
                  <h2 class="display-1 white--text font-weight-light">
                    {{details.title}}
                  </h2>
                </v-card-title>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      md="10"
                    >
                      {{details.description}}
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-timeline-item>

            <v-timeline-item
              color="amber lighten-1"
              fill-dot
              right
              small
            >
              <v-card>
                <v-card-title class="amber lighten-1 justify-end">
                  <h2 class="display-1 mr-4 white--text font-weight-light">
                    {{showLanguage('Contact')}}
                  </h2>
                  <v-icon
                    dark
                    size="42"
                  >
                    mdi-email-outline          
                  </v-icon>
                </v-card-title>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      md="10"
                    >
                      {{details.phone}}
                      <v-divider></v-divider>
                      {{details.email}}
                    </v-col>           
                  </v-row>
                </v-container>
              </v-card>
            </v-timeline-item>

            <v-timeline-item
              color="cyan lighten-1"
              fill-dot
              right
            >
              <v-card>
                <v-card-title class="cyan lighten-1">
                  <v-icon
                    class="mr-4"
                    dark
                    size="42"
                  >
                    mdi-home-outline
                  </v-icon>
                  <h2 class="display-1 white--text font-weight-light">
                    {{showLanguage('Address')}}
                  </h2>
                </v-card-title>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      md="10"
                    >
                      {{details.location}}
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-timeline-item>            
          </v-timeline>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              text
              @click="dialog = false"
            >{{showLanguage('Close')}}</v-btn>
          </v-card-actions>
        </v-card>
        </v-dialog>
      </v-col>
    </v-row>

  </v-app>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      search: "",
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 9,
      dialog: false,
      images: [],
      details: {},
    };
  },
  computed: {
    ...mapGetters([
      "allPosts",
      "getPosttotalItems",
      "getSearchObj",
      "getCurrentPage",
      "getLocalLang",
      "getPostImages"
    ]),
    numberOfPages() {
      return this.getPosttotalItems <= 9
        ? 1
        : Math.ceil(this.getPosttotalItems / 9);
    }
  },
  created() {
    this.page = this.getCurrentPage;
  },
  methods: {
    ...mapActions(["fetchPostByCat","fetchPostImage"]),
    showLanguage(prop){
      if(this.getLocalLang.length > 0)
        return this.getLocalLang.filter(x=>x.props == prop)[0].text
    },

    navigationPage(value) {
      let pageObj = Object.assign({}, this.getSearchObj);
      pageObj.pageOpt.page = value;
      this.$store.commit("setCurrentPage", value);
      this.fetchPostByCat(pageObj);
    },
    showDetails(item){
      this.fetchPostImage(item._id);
      this.details = item;
      this.dialog = true;
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