<template>
  <v-data-table
    :headers="headers"
    :items="allManageClientPosts"
    :options.sync="options"
    :server-items-length="getManageClientPosttotalItems"
    :loading="loading"
    :footer-props="{
      'items-per-page-options': items_per_page,
      showFirstLastPage: true,
    }"
    @update:options="updateOpt()"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-text-field
          v-model="search"
          clearable
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="mdi-magnify"
          label="Search"
          @click:clear="clearSearch()"
        ></v-text-field>
        <template v-if="$vuetify.breakpoint.mdAndUp">
          <v-spacer></v-spacer>
          <v-select
            v-model="searchBy"
            flat
            solo-inverted
            hide-details
            :items="searchKey"
            item-text="text"
            item-value="value"
            prepend-inner-icon="mdi-magnify"
            label="Search by"
          ></v-select>
          <v-spacer></v-spacer>
          <v-btn-toggle mandatory>
            <v-btn large depressed color="blue" :value="true" @click="searchData()">
              <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
          </v-btn-toggle>
        </template>

        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="70%">
          <template v-slot:activator="{ on, attrs }">
            <v-btn large color="red lighten-2" dark v-bind="attrs" v-on="on">
              New Item
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="headline grey lighten-2">
              <span class="headline">{{ formTitle }}</span>
              <v-spacer></v-spacer>
              <span class="headline font-weight-thin">{{ getManageClientPostMessage }}</span>
            </v-card-title>
            <ValidationObserver v-slot="{ invalid }">
              <v-card-text>
                <v-container>
                  <v-form @submit.prevent="submit" ref="form" lazy-validation>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-select
                        v-model="post.category"
                        :items="allCategorys"
                        item-text="title"
                        item-value="_id"
                        outlined
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <ValidationProvider
                          name="Title"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="post.title"
                            label="Title"
                            outlined
                            :error-messages="errors"
                            required
                          >
                          </v-text-field>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <ValidationProvider
                          name="Price"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="post.price"
                            label="Price"
                            outlined
                            :error-messages="errors"
                            required
                          >
                          </v-text-field>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <ValidationProvider
                          name="Email"
                          rules="required|email"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="post.email"
                            label="Email"
                            outlined
                            :error-messages="errors"
                            required
                          >
                          </v-text-field>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <ValidationProvider
                          name="Phone"
                          rules="required|min:9"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="post.phone"
                            label="Phone"
                            outlined
                            :error-messages="errors"
                            required
                          >
                          </v-text-field>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <ValidationProvider
                          name="Location"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="post.location"
                            label="Location"
                            outlined
                            :error-messages="errors"
                            required
                          >
                          </v-text-field>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <ValidationProvider
                          name="Description"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <v-textarea
                            v-model="post.description"
                            label="Description"
                            outlined
                            :error-messages="errors"
                            required
                          >
                          </v-textarea>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <ValidationProvider rules="size:2000000" v-slot="{ errors }">
                        <v-file-input
                          v-model="file"
                          chips
                          :error-messages="errors"
                          label="File"
                          outlined
                          multiple
                          accept="image/*"
                          prepend-icon="mdi-camera"
                          @change="Preview_image($event)"
                        ></v-file-input>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="10" offset-md="1" class="text-center">
                      <div
                        class="d-flex justify-space-around flex-row flex-wrap pa-10"
                      >
                        <v-card
                          class="mx-auto my-2"
                          color="grey lighten-4"
                          max-width="150"
                          v-for="(item, i) in urls"
                          :key="i"                       
                        >
                          <v-img
                            max-height="50"
                            max-width="150"
                            :src="item.img"
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


                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  :disabled="invalid"
                  text
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </ValidationObserver>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="50%">
          <v-card>
            <v-card-title class="headline"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="fetchManageClientPostPages"> Reset </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import * as constHelper from '../store/modules/const-helper';

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    loading: true,
    options: {},
    pageObj: {},
    items_per_page: constHelper.items_per_page,
    search: "",
    searchBy: "",
    confirmPassword: "",
    urls: [],
    image:[],
    file:null,
    storeremoveImage:[],
    headers: [
      { text: "Title", value: "title", class: "text-success indigo darken-5" },
      { text: "Phone", value: "phone", class: "text-success indigo darken-5" },
      { text: "Email", value: "email", class: "text-success indigo darken-5" },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        class: "text-success indigo darken-5",
      },
    ],
    searchKey: [
      {text: "Title", value: "title"},
      {text: "Phone", value: "phone"}
    ],
    post: {},
    posts: [],
    pagination: {},
    editedIndex: -1,
  }),
  computed: {
    ...mapGetters(["allManageClientPosts","allCategorys", "getManageClientPostMessage",
     "getManageClientPosttotalItems","getClientPostImage"]),
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },
  watch: {
    options: {
      handler() {
      let pageObj = {
        searchObj: this.search,
        searchObjby: this.searchBy,
        pageOpt: this.options
      };
        this.fetchManageClientPostPages(pageObj);
      },
      deep: true,
    },
  },
  created() {
    this.loading = true;
    this.setpageObj();
    this.fetchManageClientPostPages(this.pageObj);
    this.loading = false;
    this.fetchCategoriesWithoutLang();
  },

  methods: {
    ...mapActions([
      "fetchManageClientPostPages",
      "deleteManagePost",
      "addManagePost",
      "updateManagePost",
      "fetchCategoriesWithoutLang",
      "fetchPostImages"
    ]),

    Preview_image(e) {
      if (e.length > 0 && e.length <=8) {
        e.forEach((element) => {
          if(element.size <= 2000000){
            this.url = URL.createObjectURL(element);
            this.urls.push({_id:null,img:this.url});
            var reader = new FileReader();
            reader.onload = function(e) {
              this.image.push(e.target.result);
            }.bind(this);
            reader.readAsDataURL(element);        
          }
        });
      }
      else{
        this.file = [];
        alert('You allow only 8 attach files');
      }
    },

    removeImage(index){
      if(this.urls[index]._id != null)
        this.storeremoveImage.push(this.urls[index]._id);
      this.urls.splice(index,1);
      this.image.splice(index,1);
      console.log(this.storeremoveImage);
    },

    updateOpt() {
      console.log(this.options);
    },

    searchData(){
        this.loading = true;
        this.options = {
          page: 1,
          itemsPerPage: this.options.itemsPerPage,
          sortBy: this.options.sortBy,
          sortDesc: this.options.sortDesc
        };
        this.setpageObj();
        this.fetchManageClientPostPages(this.pageObj);
        this.loading = false;
    },

    clearSearch(){
        this.loading = true;
        this.search = '';
        this.setpageObj();
        this.fetchManageClientPostPages(this.pageObj);
        this.loading = false;
    },

    setpageObj(){
      this.pageObj = {
        searchObj: this.search,
        searchObjby: this.searchBy,
        pageOpt: this.options
      };
    },

    async editItem(item) {
      await this.fetchPostImages(item._id);
      this.editedIndex = this.allManageClientPosts.indexOf(item);
      this.urls = [];
      for (const data of this.getClientPostImage) {
        let dataBuffer = this.readBufferImg(data.image);
        this.urls.push({_id:data._id,img:dataBuffer});
      }
      this.post = Object.assign({},item);
      this.dialog = true;
    },

    readBufferImg(image) {
      var bytes = new Uint8Array(image.data);
      var binary = bytes.reduce(
        (data, b) => (data += String.fromCharCode(b)),
        ""
      );
      return binary;
    },

    deleteItem(item) {
      this.editedIndex = this.allManageClientPosts.indexOf(item);
      this.post = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteManagePost(this.post._id);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.storeremoveImage = [];
      this.$nextTick(() => {
        this.post = Object.assign({}, {});
        this.confirmPassword = "";
        this.editedIndex = -1;
      });
      this.$store.commit("updateManageMessage", "");
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.post = Object.assign({}, {});
        this.editedIndex = -1;
      });
    },

    save() {
      this.post.image = this.image;
      if (this.editedIndex > -1) {
        this.post.removeimage = this.storeremoveImage;
        this.updateManagePost(this.post);
      } else {
        this.addManagePost(this.post);
      }
      this.storeremoveImage = [];
    },
  },
};
</script>
<style scoped>
</style>