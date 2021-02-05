<template>
  <v-app>
    <v-card flat>
      <v-tabs v-model="tab" fixed-tabs background-color="indigo" dark>
        <v-tab> APPLICATION </v-tab>
        <v-tab> CONSTANT </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-container>
            <v-card class="mx-auto">
              <v-card-text>
                <v-row class="pa-4" justify="space-between">
                  <v-treeview
                    :items="allScreen"
                    :open.sync="open"
                    open-on-click
                    selection-type="independent"
                  >
                    <template v-slot:prepend="{ item }">
                      <v-list-item @click="showLocalization(item)">
                        <v-icon
                          v-if="item"
                          v-text="'mdi-folder-network'"
                        ></v-icon>
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
                        <ValidationObserver v-slot="{ invalid }">
                          <v-card height="100%">
                            <v-btn
                              large
                              color="red lighten-2"
                              dark
                              :disabled="invalid"
                              @click="saveLocal()"
                            >
                              SAVE
                            </v-btn>
                            <v-alert
                              v-if="getLocalizationMessage != ''"
                              outlined
                              type="success"
                              text
                            >
                              {{ getLocalizationMessage }}
                            </v-alert>
                            <v-card-text>
                              <v-divider></v-divider>
                              <v-form
                                @submit.prevent="submit"
                                ref="form"
                                lazy-validation
                              >
                                <v-col class="mx-auto my-auto" cols="12">
                                  <ValidationProvider
                                    name="Props"
                                    rules="required"
                                    v-slot="{ errors }"
                                  >
                                    <v-autocomplete
                                      v-model="localizeObj.props"
                                      :items="screens"
                                      :error-messages="errors"
                                      outlined
                                      chips
                                      small-chips
                                      label="Props"
                                      return-object
                                      @change="onChangeLocal()"
                                    ></v-autocomplete>
                                  </ValidationProvider>
                                </v-col>
                                <v-col class="mx-auto my-auto" cols="12">
                                  <ValidationProvider
                                    name="Lang"
                                    rules="required"
                                    v-slot="{ errors }"
                                  >
                                    <v-autocomplete
                                      v-model="localizeObj.lang"
                                      :items="allLanguages"
                                      :error-messages="errors"
                                      outlined
                                      chips
                                      small-chips
                                      label="Language"
                                      item-text="title"
                                      item-value="_id"
                                      @change="onChangeLocal()"
                                    ></v-autocomplete>
                                  </ValidationProvider>
                                </v-col>
                                <v-col class="mx-auto my-auto" cols="12">
                                  <ValidationProvider
                                    name="Text"
                                    rules="required"
                                    v-slot="{ errors }"
                                  >
                                    <v-text-field
                                      v-model="localizeObj.text"
                                      chips
                                      outlined
                                      label="Text"
                                      :error-messages="errors"
                                      required
                                    >
                                    </v-text-field>
                                  </ValidationProvider>
                                </v-col>
                              </v-form>
                            </v-card-text>
                          </v-card>
                        </ValidationObserver>
                      </div>
                    </v-scroll-y-transition>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-container>
            <v-card class="mx-auto">
              <v-card-text>
                <v-row class="pa-4" justify="space-between">
                  <v-treeview
                    :items="allContants"
                    :open.sync="open"
                    open-on-click
                    selection-type="independent"
                  >
                    <template v-slot:prepend="{ item }">
                      <v-list-item @click="showConstant(item)">
                        <v-icon
                          v-if="item"
                          v-text="'mdi-folder-network'"
                        ></v-icon>
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
                        <ValidationObserver v-slot="{ invalid }">
                          <v-card height="100%">
                            <v-btn
                              large
                              color="red lighten-2"
                              dark
                              :disabled="invalid"
                              @click="saveLocal()"
                            >
                              SAVE
                            </v-btn>
                            <v-alert
                              v-if="getLocalizationMessage != ''"
                              outlined
                              type="success"
                              text
                            >
                              {{ getLocalizationMessage }}
                            </v-alert>
                            <v-card-text>
                              <v-divider></v-divider>
                              <v-form
                                @submit.prevent="submit"
                                ref="form"
                                lazy-validation
                              >
                                <v-col class="mx-auto my-auto" cols="12">
                                  <ValidationProvider
                                    name="Props"
                                    rules="required"
                                    v-slot="{ errors }"
                                  >
                                    <v-autocomplete
                                      v-model="localizeObj.props"
                                      :items="constants"
                                      :error-messages="errors"
                                      outlined
                                      chips
                                      small-chips
                                      label="Props"
                                      return-object
                                      @change="onChangeLocal()"
                                    ></v-autocomplete>
                                  </ValidationProvider>
                                </v-col>
                                <v-col class="mx-auto my-auto" cols="12">
                                  <ValidationProvider
                                    name="Lang"
                                    rules="required"
                                    v-slot="{ errors }"
                                  >
                                    <v-autocomplete
                                      v-model="localizeObj.lang"
                                      :items="allLanguages"
                                      :error-messages="errors"
                                      outlined
                                      chips
                                      small-chips
                                      label="Language"
                                      item-text="title"
                                      item-value="_id"
                                      @change="onChangeLocal()"
                                    ></v-autocomplete>
                                  </ValidationProvider>
                                </v-col>
                                <v-col class="mx-auto my-auto" cols="12">
                                  <ValidationProvider
                                    name="Text"
                                    rules="required"
                                    v-slot="{ errors }"
                                  >
                                    <v-text-field
                                      v-model="localizeObj.text"
                                      chips
                                      outlined
                                      label="Text"
                                      :error-messages="errors"
                                      required
                                    >
                                    </v-text-field>
                                  </ValidationProvider>
                                </v-col>
                              </v-form>
                            </v-card-text>
                          </v-card>
                        </ValidationObserver>
                      </div>
                    </v-scroll-y-transition>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-app>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data: () => ({
    isLoading: false,
    valueOfroles: null,
    open: [1],
    selected: false,
    screens: [],
    constants: [],
    valueOfItem: [],
    localizeObj: {},
    tab: null,
  }),
  created() {
    this.fetchAllScreen();
    this.fetchLanguages();
    this.fetchConstant();
  },
  methods: {
    ...mapActions([
      "fetchLanguages",
      "fetchAllScreen",
      "addLocalization",
      "fetchLocalization",
      "updateLocalization",
      "fetchConstant"
    ]),
    showLocalization(item) {
      this.selected = true;
      this.screens = item.props;
      this.localizeObj.parent = item.parent;
      this.$store.commit("updateMessage", "");
    },
    showConstant(item){
      this.selected = true;
      this.constants = item.props;
      this.localizeObj.parent = item.parent;
      this.$store.commit("updateMessage", "");
    },
    async onChangeLocal() {
      this.localizeObj.text = "";
      this.localizeObj._id = null;
      await this.fetchLocalization(this.localizeObj);
      if (this.allLocalizations.length > 0)
        this.localizeObj = Object.assign({}, this.allLocalizations[0]);
    },
    saveLocal() {
      console.log(this.localizeObj);
      if(this.localizeObj._id != null){
        this.updateLocalization(this.localizeObj);
      }else{
        this.addLocalization(this.localizeObj);
      }
    },
  },
  computed: {
    ...mapGetters([
      "allLanguages",
      "allScreen",
      "getLocalizationMessage",
      "allLocalizations",
      "allContants"
    ]),
  },
  watch: {},
};
</script>