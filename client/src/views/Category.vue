<template>
  <v-data-table
    :headers="headers"
    :items="allCategorys"
    :options.sync="options"
    :server-items-length="getCategorytotalItems"
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
              <span class="headline font-weight-thin">{{ getCategoryMessage }}</span>
            </v-card-title>
            <ValidationObserver v-slot="{ invalid }">
              <v-card-text>
                <v-container>
                  <v-form @submit.prevent="submit" ref="form" lazy-validation>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <ValidationProvider
                          name="Title"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="category.title"
                            label="Title"
                            :error-messages="errors"
                            outlined
                            required
                          >
                          </v-text-field>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                          <ValidationProvider
                            name="Lang"
                            rules="required"
                            v-slot="{ errors }"
                          >
                            <v-autocomplete
                              v-model="category.lang"
                              :items="allLanguages"
                              :error-messages="errors"
                              outlined
                              chips
                              small-chips
                              label="Language"
                              item-text="title"
                              item-value="_id"
                            ></v-autocomplete>
                          </ValidationProvider>
                        </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <ValidationProvider
                          name="Icon"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="category.icon"
                            label="Icon"
                            :error-messages="errors"
                            outlined
                            required
                          >
                          </v-text-field>
                        </ValidationProvider>
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
      <v-btn color="primary" @click="fetchCategoryPages"> Reset </v-btn>
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
    headers: [
      { text: "Title", value: "title", class: "text-success indigo darken-5" },
      { text: "Language", value: "lang.title", class: "text-success indigo darken-5" },
      { text: "Icon", value: "icon", class: "text-success indigo darken-5" },
      { text: "Date", value: "date", class: "text-success indigo darken-5" },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        class: "text-success indigo darken-5",
      },
    ],
    searchKey: [
      {text: "Title", value: "title"},
      {text: "Language", value: "lang"}
    ],
    category: {},
    categorys: [],
    pagination: {},
    editedIndex: -1,
  }),
  computed: {
    ...mapGetters(["allCategorys", "getCategoryMessage", 
    "getCategorytotalItems","allLanguages"]),
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    options: {
      handler() {
      let pageObj = {
        searchObj: this.search,
        searchObjby: this.searchBy,
        pageOpt: this.options
      };
        this.fetchCategoryPages(pageObj);
      },
      deep: true,
    },
  },
  created() {
    this.loading = true;
    this.setpageObj();
    this.fetchCategoryPages(this.pageObj);
    this.loading = false;
    this.fetchLanguages();
  },

  methods: {
    ...mapActions([
      "fetchCategoryPages",
      "fetchCategorySearch",
      "deleteCategory",
      "addCategory",
      "updateCategory",
      "fetchLanguages",
    ]),

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
        this.fetchCategoryPages(this.pageObj);
        this.loading = false;
    },

    clearSearch(){
        this.loading = true;
        this.search = '';
        this.setpageObj();
        this.fetchCategoryPages(this.pageObj);
        this.loading = false;
    },

    setpageObj(){
      this.pageObj = {
        searchObj: this.search,
        searchObjby: this.searchBy,
        pageOpt: this.options
      };
    },

    editItem(item) {
      this.editedIndex = this.allCategorys.indexOf(item);
      this.category = Object.assign(
        {},item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.allCategorys.indexOf(item);
      this.category = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteCategory(this.category._id);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.category = Object.assign({}, {});
        this.editedIndex = -1;
      });
      this.$store.commit("updateMessage", "");
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.category = Object.assign({}, {});
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        this.updateCategory(this.category);
      } else {
        console.log(this.category);
        this.addCategory(this.category);
      }
    },
  },
};
</script>
<style scoped>
</style>