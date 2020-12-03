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
      <v-treeview
        :items="allRouter_Screen"
        :search="search"
        :filter="filter"
        :open.sync="open"
      >
        <template v-slot:prepend="{ item }">
          <v-icon
            v-if="item.children"
            v-text="`mdi-${item.id === 1 ? 'home-variant' : 'folder-network'}`"
          ></v-icon>
        </template>
      </v-treeview>
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

  // items: [
  //       {
  //         id: 1,
  //         name: 'Vuetify Human Resources',
  //         children: [
  //           {
  //             id: 2,
  //             name: 'Core team',
  //             children: [
  //               {
  //                 id: 201,
  //                 name: 'John',
  //               },
  //               {
  //                 id: 202,
  //                 name: 'Kael',
  //               },
  //               {
  //                 id: 203,
  //                 name: 'Nekosaur',
  //               },
  //               {
  //                 id: 204,
  //                 name: 'Jacek',
  //               },
  //               {
  //                 id: 205,
  //                 name: 'Andrew',
  //               },
  //             ],
  //           },
  //           {
  //             id: 3,
  //             name: 'Administrators',
  //             children: [
  //               {
  //                 id: 301,
  //                 name: 'Mike',
  //               },
  //               {
  //                 id: 302,
  //                 name: 'Hunt',
  //               },
  //             ],
  //           },
  //           {
  //             id: 4,
  //             name: 'Contributors',
  //             children: [
  //               {
  //                 id: 401,
  //                 name: 'Phlow',
  //               },
  //               {
  //                 id: 402,
  //                 name: 'Brandon',
  //               },
  //               {
  //                 id: 403,
  //                 name: 'Sean',
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
      open: [1, 2],
      search: null,
      caseSensitive: false,




  }),
  created () {
    this.fetchAllRouter_Screen();
  },
  methods: {
    ...mapActions([
      "fetchRoleSearch","fetchAllRouter_Screen"
    ])
  },
  computed: {
    ...mapGetters(["allRoles","allRouter_Screen"]),
    filter () {
        return this.caseSensitive
          ? (item, search, textKey) => item[textKey].indexOf(search) > -1
          : undefined
      },
  },
  watch: {
      searchroles(val){
      if(val){
        if (this.isLoading) return
        this.isLoading = true;
        this.fetchRoleSearch(val);
        this.isLoading = false;
      }
    }
  }
};
</script>