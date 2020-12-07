<template>
  <v-app>
    <v-card outlined elevation="2">
      <v-container class="my-auto">
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
        </v-form>
        


  <v-card
    class="mx-auto"
  >
    <v-sheet class="pa-4 primary lighten-2">
      <v-text-field
        v-model="search"
        label="Search Company Directory"
        dark
        flat
        solo-inverted
        hide-details
        clearable
        clear-icon="mdi-close-circle-outline"
      ></v-text-field>
      <v-checkbox
        v-model="caseSensitive"
        dark
        hide-details
        label="Case sensitive search"
      ></v-checkbox>
    </v-sheet>
    <v-card-text>
      <v-row
      class="pa-4"
      justify="space-between"
    >
      <v-treeview
        :items="allRouter_Screen"
        :search="search"
        :filter="filter"
        :open.sync="open"
        open-on-click
        selection-type="independent"
        activatable
      >
      <template v-slot:prepend="{ item }">
        <v-list-item @click="showPermission(item)">
            <v-icon
            v-if="item"
            v-text="'mdi-folder-network'"
          ></v-icon>
        </v-list-item>
      </template>

      </v-treeview>

      <v-divider vertical></v-divider>

      <v-col
        class="d-flex text-center"
      >
        <v-scroll-y-transition mode="out-in">
          <div
            v-if="!selected"
            class="title grey--text text--lighten-1 font-weight-light"
            style="align-self: center;"
          >
            Select Items
          </div>
          <div v-else>
            <v-card height="100%">
              <v-card-title>{{permissionHeader}}</v-card-title>
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
                    label="Routers"
                    multiple
                    return-object
                    @change="changeSelected()"
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
                    @change="changeSelected()"
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
import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
// import * as constHelper from '../store/modules/const-helper';

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

export default {
  data: () => ({
    isLoading: false,
    valueOfroles: [],
    searchroles:null,
    open: [1],
    search: null,
    caseSensitive: false,
    selected: false,
    isprops: false,
    screens:[],
    routers:[],
    permissionHeader:'',
    valuesOfAuth:[],
    parent:'',
    child:'',
    valueOfItem:[]
  }),
  created () {
    this.fetchAllRouter_Screen();
  },
  methods: {
    ...mapActions([
      "fetchRoleSearch","fetchAllRouter_Screen"
    ]),
    showPermission(item){
      this.selected = true;
      this.parent = item.parent;
      this.child = item.name;
      this.permissionHeader = item.parent + '-' + item.name;
      if(item.name == 'Props'){
        this.isprops = true;
        this.screens = item.props
      }
      else if(item.name == 'Routers'){
        this.isprops = false;
        this.routers = item.routers;
      }
      else{
        this.selected = false;
      }
    },
    changeSwitch(item){
      let switchindex = this.valueOfItem.indexOf(item);
      (switchindex == -1) ? this.valueOfItem.push(item) : this.valueOfItem.splice(switchindex,1);
      // let propchild = {
      //   parent: this.parent,
      //   name: this.child,
      //   value: this.valueOfItem
      // }
      console.log(this.valueOfItem);
    },
    changeSelected(){
      let propchild = {
        parent: this.parent,
        name: this.child,
        value: this.valueOfItem
      };
      console.log(propchild);
    }
  },
  computed: {
    ...mapGetters(["allRoles","allRouter_Screen"]),
    filter () {
        return this.caseSensitive
          ? (item, search, textKey) => item[textKey].indexOf(search) > -1
          : undefined
      }
  },
  watch: {
      searchroles(val){
      if(val){
        if (this.isLoading) return
        this.isLoading = true;
        this.fetchRoleSearch(val);
        this.isLoading = false;
      }
    },
  }
};
</script>