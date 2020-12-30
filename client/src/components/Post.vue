<template>
  <div>
    <v-stepper v-model="e1" non-linear>
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" editable step="1">
          Select Category
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" editable step="2">
          Input Information
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card height="80vh" class="mx-auto my-auto">
            <div class="d-flex justify-center flex-row flex-wrap">
              <div v-for="(item, i) in allCategorys" :key="i">
                <v-btn
                  class="ma-2"
                  outlined
                  color="indigo"
                  x-large
                  @click="selectCategory(item)"
                >
                  <v-icon x-large left>
                    {{ item.icon }}
                  </v-icon>
                  {{ item.title }}
                </v-btn>
              </div>
            </div>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card height="100%" class="mx-auto my-auto">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="10" offset-md="1">
                  <v-text-field
                    v-model="post.category"
                    hint="You must input the category"
                    label="Your category"
                    persistent-hint
                    outlined
                    disabled
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="10" offset-md="1">
                  <v-text-field
                    v-model="post.title"
                    hint="You must input the tittle"
                    label="Your tittle"
                    persistent-hint
                    outlined
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="10" offset-md="1">
                  <v-textarea
                    v-model="post.description"
                    outlined
                    label="Your description"
                  ></v-textarea>
                </v-col>
                <v-col cols="10" offset-md="1">
                  <v-text-field
                    v-model="post.phone"
                    hint="You must input the phone"
                    label="Your phone"
                    persistent-hint
                    outlined
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="10" offset-md="1">
                  <v-text-field
                    v-model="post.email"
                    hint="You must input the email"
                    label="Your email"
                    persistent-hint
                    outlined
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="10" offset-md="1">
                  <v-text-field
                    v-model="post.location"
                    hint="You must input the location"
                    label="Your location"
                    persistent-hint
                    outlined
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="10" offset-md="1">
                  <v-file-input
                    chips
                    label="File input w/ chips"
                    outlined
                    multiple
                    v-model="image"
                    accept="image/*"
                    prepend-icon="mdi-camera"
                    @change="Preview_image($event)"
                  ></v-file-input>
                </v-col>
                <v-col cols="10" offset-md="1" class="text-center">
                  <div
                    class="d-flex justify-space-around flex-row flex-wrap ma-2"
                  >
                    <v-card
                      class="mx-auto"
                      color="grey lighten-4"
                      max-width="150"
                      v-for="(item, i) in urls"
                      :key="i"
                      :src="item"
                    >
                      <v-img
                        max-height="50"
                        max-width="150"
                        :src="item"
                      ></v-img>
                      <v-card-text class="pt-6" style="position: relative">
                        <v-btn
                          absolute
                          color="orange"
                          class="white--text"
                          fab
                          small
                          right
                          top
                        >
                          <v-icon small>mdi-delete</v-icon>
                        </v-btn>
                      </v-card-text>
                    </v-card>
                  </div>
                </v-col>
                <v-col cols="10" offset-md="1" class="text-center">
                  <v-btn tile color="success" x-large>
                    <v-icon left> mdi-pencil </v-icon>
                    POST
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data: () => ({
    e1: 1,
    valid: true,
    post: {},
    url: null,
    image: null,
    urls: [],
  }),
  computed: {
    ...mapGetters(["allCategorys", "getCategoryMessage"]),
  },
  methods: {
    ...mapActions(["fetchCategories"]),
    Preview_image(e) {
      if (e.length > 0) {
        e.forEach((element) => {
          this.url = URL.createObjectURL(element);
          this.urls.push(this.url);
        });
      }
    },
    selectCategory(item){
      this.e1 = 2;
      this.post.category = item.title;
    }
  },
  created() {
    this.fetchCategories();
  },
};
</script>