<template>
  <v-data-table
    :headers="headers"
    :items="allRoles"
    :options.sync="options"
    :server-items-length="getRoletotalItems"
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
              <span class="headline font-weight-thin">{{ getRoleMessage }}</span>
            </v-card-title>
            <ValidationObserver v-slot="{ invalid }">
              <v-card-text>
                <v-container>
                  <v-form @submit.prevent="submit" ref="form" lazy-validation>
                      <v-col class="mx-auto my-auto" cols="12">
                        <ValidationProvider
                          name="Name"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="role.name"
                            chips
                            outlined
                            label="Name"
                            :error-messages="errors"
                            required
                          >
                          </v-text-field>
                        </ValidationProvider>
                      </v-col>
                      <v-col class="mx-auto my-auto">
                        <ValidationProvider
                          name="Name"
                          rules="required"
                          v-slot="{ errors }"
                        >
                      <v-autocomplete
                          v-model="valueOfuser"
                          :items="allUsers"
                          :loading="isLoading"
                          :search-input.sync="searchuser"
                          item-text="email"
                          item-value="_id"
                          outlined
                          chips
                          hide-selected
                          label="Users"
                          :error-messages="errors"
                          multiple
                          return-object
                        >
                        <template v-slot:selection="data">
                          <v-chip
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            close
                            @click="data.select"
                            @click:close="remove(data.item)"
                          >
                            {{ data.item.name }}
                          </v-chip>
                        </template>
                        </v-autocomplete>
                        </ValidationProvider>
                    </v-col>
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
      <v-btn color="primary" @click="fetchRolePages"> Reset </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    loading: true,
    options: {},
    pageObj: {},
    items_per_page: [2, 3, 50, 100, 500, 1000, -1],
    search: "",
    searchuser:null,
    isLoading: false,
    searchBy: "",
    valueOfuser: [],
    headers: [
      { text: "Name", value: "name", class: "text-success indigo darken-5" },
      { text: "Date", value: "date", class: "text-success indigo darken-5" },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        class: "text-success indigo darken-5",
      },
    ],
    searchKey: [
      {text: "Name", value: "name"},
      {text: "Date", value: "date"}
    ],
    role: {},
    roles: [],
    pagination: {},
    editedIndex: -1,
  }),
  computed: {
    ...mapGetters(["allRoles","allUsers", "getRoleMessage", "getRoletotalItems"]),
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
        this.fetchRolePages(pageObj);
      },
      deep: true,
    },
    searchuser(val){
      if(val){
        if (this.isLoading) return
        this.isLoading = true;
        this.fetchUserSearch(val);
        this.isLoading = false;
      }
    }
  },
  created() {
    this.loading = true;
    this.setpageObj();
    this.fetchRolePages(this.pageObj);
    this.loading = false;
  },

  methods: {
    ...mapActions([
      "fetchRolePages",
      "fetchUserSearch",
      "deleteRole",
      "addRole",
      "updateRole",
    ]),

    updateOpt() {
      console.log(this.options);
    },

    remove (item) {
      const index = this.valueOfuser.indexOf(item);
      if (index >= 0) this.valueOfuser.splice(index, 1);
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
        this.fetchRolePages(this.pageObj);
        this.loading = false;
    },

    clearSearch(){
        this.loading = true;
        this.search = '';
        this.setpageObj();
        this.fetchRolePages(this.pageObj);
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
      this.editedIndex = this.allRoles.indexOf(item);
      this.role = Object.assign(
        {},
        { _id: item._id, name: item.name }
      );
      this.$store.commit("setUserSearch", item.users);
      this.valueOfuser = item.users;
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.allRoles.indexOf(item);
      this.role = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteRole(this.role._id);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.role = Object.assign({}, {});
        this.editedIndex = -1;
      });
      this.$store.commit("updateMessage", "");
      this.valueOfuser = [];
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.role = Object.assign({}, {});
        this.editedIndex = -1;
      });
    },

    save() {
      let docObj = {
        _id: this.role._id,
        name: this.role.name,
        users: this.valueOfuser.map(element => ({
          _id: element._id
        }))
      };
      if (this.editedIndex > -1) {
        this.updateRole(docObj);
      } else {
        this.addRole(docObj);
      }
    },
  },
};
</script>
<style scoped>
</style>