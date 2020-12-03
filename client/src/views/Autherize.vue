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
  }),
  methods: {
    ...mapActions([
      "fetchRoleSearch"
    ])
  },
  computed: {
    ...mapGetters(["allRoles"]),
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