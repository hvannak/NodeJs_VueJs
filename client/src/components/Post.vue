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
            <ValidationObserver v-slot="{ invalid }">
            <v-form ref="form" v-model="valid" @submit.prevent="submit" lazy-validation>
              <v-row>
                <v-col cols="10" offset-md="1">
                  <ValidationProvider
                                name="Category"
                                rules="required"
                                v-slot="{ errors }"
                              >
                  <v-text-field
                    v-model="post.category"
                    hint="You must input the category"
                    label="Your category"
                    :error-messages="errors"
                    persistent-hint
                    outlined
                    disabled
                    required
                  >
                  </v-text-field>
                  </ValidationProvider>
                </v-col>
                <v-col cols="10" offset-md="1">
                  <ValidationProvider
                                name="Title"
                                rules="required"
                                v-slot="{ errors }"
                              >
                  <v-text-field
                    v-model="post.title"
                    :error-messages="errors"
                    hint="You must input the title"
                    label="Your title"
                    persistent-hint
                    outlined
                    required
                  >
                  </v-text-field>
                  </ValidationProvider>
                </v-col>
                <v-col cols="10" offset-md="1">
                  <ValidationProvider
                                name="Description"
                                rules="required|min:6"
                                v-slot="{ errors }"
                              >
                  <v-textarea
                    v-model="post.description"
                    :error-messages="errors"
                    outlined
                    label="Your description"
                  ></v-textarea>
                  </ValidationProvider>
                </v-col>
                <v-col cols="10" offset-md="1">
                  <ValidationProvider
                                name="Phone"
                                rules="required"
                                v-slot="{ errors }"
                              >
                  <v-text-field
                    v-model="post.phone"
                    :error-messages="errors"
                    hint="You must input the phone"
                    label="Your phone"
                    persistent-hint
                    outlined
                    required
                  >
                  </v-text-field>
                  </ValidationProvider>
                </v-col>
                <v-col cols="10" offset-md="1">
                  <ValidationProvider
                                name="Email"
                                rules="email"
                                v-slot="{ errors }"
                              >
                  <v-text-field
                    v-model="post.email"
                    :error-messages="errors"
                    hint="You must input the email"
                    label="Your email"
                    persistent-hint
                    outlined
                    required
                  >
                  </v-text-field>
                  </ValidationProvider>
                </v-col>
                <v-col cols="10" offset-md="1">
                  <ValidationProvider
                                name="Location"
                                rules="required"
                                v-slot="{ errors }"
                              >
                  <v-text-field
                    v-model="post.location"
                    :error-messages="errors"
                    hint="You must input the location"
                    label="Your location"
                    persistent-hint
                    outlined
                    required
                  >
                  </v-text-field>
                  </ValidationProvider>
                </v-col>
                <v-col cols="10" offset-md="1">
                  <v-file-input
                    v-model="file"
                    chips
                    label="File input w/ chips"
                    outlined
                    multiple
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
                          @click="removeImage(i)"
                        >
                          <v-icon small>mdi-delete</v-icon>
                        </v-btn>
                      </v-card-text>
                    </v-card>
                  </div>
                </v-col>
                <v-col cols="10" offset-md="1" class="text-center">

                          <v-dialog
                            transition="dialog-bottom-transition"
                            max-width="600"
                            persistent
                            v-model="dialog"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn tile color="success" :disabled="invalid" x-large
                                v-bind="attrs"
                                v-on="on"
                                @click="save">
                                <v-icon left> mdi-pencil </v-icon>
                                POST
                              </v-btn>
                            </template>
                              <v-card>
                                <v-toolbar
                                  color="primary"
                                  dark
                                >Opening Post Message</v-toolbar>
                                <v-card-text>
                                  <div class="text-h2 pa-12">Status when save</div>
                                </v-card-text>
                                <v-card-actions class="justify-end">
                                  <v-btn
                                    text
                                    @click="closedialog()"
                                  >Close</v-btn>
                                </v-card-actions>
                              </v-card>
                          </v-dialog>



                </v-col>
              </v-row>
            </v-form>
            </ValidationObserver>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { extend } from "vee-validate";
import { required, email, min } from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

extend("min", {
  ...min,
  message: "{_field_} may not be lesser than {length} characters",
});

extend("email", {
  ...email,
});

export default {
  data: () => ({
    e1: 1,
    valid: true,
    post: {},
    url: null,
    urls: [],
    dialog: false,
    image:[],
    file:null
  }),
  computed: {
    ...mapGetters(["allCategorys", "getCategoryMessage"]),
  },
  methods: {
    ...mapActions(["fetchCategories","addPost"]),
    Preview_image(e) {
      if (e.length > 0) {
        e.forEach((element) => {
          this.url = URL.createObjectURL(element);
          this.urls.push(this.url);
          var reader = new FileReader();
          reader.onload = function(e) {
            this.image.push(e.target.result);
          }.bind(this);
          reader.readAsDataURL(element);
        });
      }
    },
    selectCategory(item){
      this.e1 = 2;
      this.post = {
        categoryId: item._id,
        category: item.title
      }
    },
    removeImage(index){
      this.urls.splice(index,1);
      this.image.splice(index,1);
    },
    async save(){
      // let blob = await fetch(this.urls[0]).then(r => r.blob());
      this.post.image = this.image;
      this.addPost(this.post);
      this.urls = [];
      this.file = null;
    },
    closedialog(){
      this.dialog = false;
      this.e1 = 1;
      this.post = {};
    }
  },
  created() {
    this.fetchCategories();
  },
};
</script>