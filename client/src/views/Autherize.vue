<template>
  <v-app>
    <v-card outlined elevation="2">
      <v-container class="my-auto">
        <v-alert
          v-if="getAutherizeMessage != ''"
          outlined
          type="warning"
          text
        >
          {{ getAutherizeMessage }}
        </v-alert>
        <v-form ref="form">
          <ValidationProvider name="Role" rules="required" v-slot="{ errors }">
            <v-autocomplete
              v-model="valueOfroles"
              :items="allRoles"
              :loading="isLoading"
              :search-input.sync="searchroles"
              item-text="name"
              item-value="_id"
              outlined
              chips
              hide-selected
              label="Roles"
              :error-messages="errors"
              return-object
              @change="changeRole()"
            >
              <template v-slot:selection="data">
                <v-chip
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  close
                  @click="data.select"
                  @click:close="remove()"
                >
                  {{ data.item.name }}
                </v-chip>
              </template>
            </v-autocomplete>
          </ValidationProvider>
        </v-form>

        <v-card class="mx-auto">
          <v-card-text>
            <v-row class="pa-4" justify="space-between">
              <v-treeview
                :items="allRouter_Screen"
                :open.sync="open"
                open-on-click
                selection-type="independent"
              >
                <template v-slot:prepend="{ item }">
                  <v-list-item @click="showPermission(item)">
                    <v-icon v-if="item" v-text="'mdi-folder-network'"></v-icon>
                  </v-list-item>
                </template>
              </v-treeview>

              <v-divider vertical></v-divider>

              <v-col class="d-flex text-center">
                <v-scroll-y-transition mode="out-in">
                  <div
                    v-if="!selected"
                    class="title grey--text text--lighten-1 font-weight-light"
                    style="align-self: center"
                  >
                    Select Items
                  </div>
                  <div v-else>
                    <v-card height="100%">
                      <v-btn
                        large
                        color="red lighten-2"
                        dark
                        @click="saveAuth()"
                      >
                        SAVE {{ permissionHeader }}
                      </v-btn>
                      <v-alert
                        v-if="getAutherizeMessage != ''"
                        outlined
                        type="success"
                        text
                      >
                        {{ getAutherizeMessage }}
                      </v-alert>
                      <v-card-text>
                        <v-divider></v-divider>
                        <div v-if="isprops">
                          <v-autocomplete
                            v-model="valueOfItem"
                            :items="screens"
                            outlined
                            dense
                            chips
                            small-chips
                            label="Props"
                            multiple
                            return-object
                          ></v-autocomplete>
                        </div>
                        <div v-else>
                          <v-autocomplete
                            v-model="valueOfItem"
                            :items="routers"
                            item-text="path"
                            item-value="path"
                            outlined
                            dense
                            chips
                            small-chips
                            label="Routers"
                            multiple
                            return-object
                          ></v-autocomplete>
                        </div>
                      </v-card-text>
                    </v-card>
                  </div>
                </v-scroll-y-transition>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-card>
  </v-app>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data: () => ({
    isLoading: false,
    valueOfroles: null,
    searchroles: null,
    open: [1],
    caseSensitive: false,
    selected: false,
    isprops: false,
    screens: [],
    routers: [],
    permissionHeader: "",
    valuesOfAuth: [],
    parent: "",
    child: "",
    valueOfItem: [],
  }),
  created() {
    this.fetchAllRouter_Screen();
    console.log(this.getAutherizeMessage);
  },
  methods: {
    ...mapActions([
      "fetchRoleSearch",
      "fetchAllRouter_Screen",
      "fetchAutherizeearch",
      "addAutherize",
      "updateAutherize",
    ]),
    showPermission(item) {
      this.selected = true;
      this.parent = item.parent;
      this.child = item.name;
      this.permissionHeader = item.parent + "-" + item.name;
      this.valueOfItem = [];
      this.$store.commit("updateMessage", "");
      if (this.allAutherizes.length > 0) {
        let index = this.allAutherizes.findIndex(
          (x) => x.parent == item.parent && x.name == item.name
        );
        if (index != -1) this.valueOfItem = this.allAutherizes[index].values;
      }

      if (item.name == "props") {
        this.isprops = true;
        this.screens = item.props;
      } else if (item.name == "routers") {
        this.isprops = false;
        this.routers = item.routers;
      } else {
        this.selected = false;
      }
    },
    remove() {
      this.valueOfroles = null;
    },
    changeRole() {
      if(this.valueOfroles != null)
        this.fetchAutherizeearch(this.valueOfroles._id);
    },
    saveAuth() {
      if (this.valueOfroles != null && this.valueOfItem.length > 0) {
        let index = this.allAutherizes.findIndex(x=> x.parent == this.parent && x.name == this.child);
        if (index == -1) {
          let authdata = {
            role: this.valueOfroles._id,
            parent: this.parent,
            name: this.child,
            values: this.valueOfItem,
          };
          console.log('insert');
          this.addAutherize(authdata);
        } else {
          let authdata = {
            _id: this.allAutherizes[index]._id,
            role: this.valueOfroles._id,
            parent: this.parent,
            name: this.child,
            values: this.valueOfItem,
          };
          console.log('update');
          this.updateAutherize(authdata);
        }
      }
      else{
        this.$store.commit("updateMessage", "Please correct your input data.");
      }
    },
  },
  computed: {
    ...mapGetters([
      "allRoles",
      "allRouter_Screen",
      "allAutherizes",
      "getAutherizeMessage",
    ]),
  },
  watch: {
    searchroles(val) {
      if (val) {
        if (this.isLoading) return;
        this.isLoading = true;
        this.fetchRoleSearch(val);
        this.isLoading = false;
      }
    },
  },
};
</script>