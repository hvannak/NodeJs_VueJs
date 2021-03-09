<template>
  <v-app>
    <v-main>
      <v-app-bar app color="primary" dark>
        <div class="d-flex align-center">
          <router-link to="/">
          <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
            transition="scale-transition"
            width="40"
          />
          </router-link>

          <v-speed-dial
            v-model="fab"
            :top="top"
            :bottom="bottom"
            :right="right"
            :left="left"
            :direction="direction"
            :open-on-hover="hover"
            :transition="transition"
          >
            <template v-slot:activator>
              <v-btn v-model="fab" color="blue darken-2" dark fab>
                <v-icon v-if="fab"> mdi-close </v-icon>
                <v-icon v-else> mdi-web </v-icon>
              </v-btn>
            </template>
            <v-btn v-for="item in allLanguages"
              :key="item.title" fab dark small color="green" @click="changeLanguage(item._id)">
              {{item.shortcode}}
            </v-btn>
          </v-speed-dial>
        </div>

        <v-spacer></v-spacer>

        <div class="mx-auto mt-6">
          <v-form>
            <v-row>
              <v-col cols="6" md="6">
                <v-select
                  v-model="value"
                  :items="getAllCategorys"
                  item-text="title"
                  item-value="_id"
                  outlined
                  dense
                  return-object
                ></v-select>
              </v-col>

              <v-col cols="6" md="6">
                <v-text-field
                  v-model="searchdata"
                  :append-icon="
                    search
                      ? 'mdi-arrow-right-bold-box'
                      : 'mdi-arrow-right-bold-box-outline'
                  "
                  clearable
                  :label="`${showLanguage('Looking')}`"
                  required
                  outlined
                  dense
                  @click:append="searchPost"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <v-dialog
            transition="dialog-bottom-transition"
            max-width="600"
            v-model="messagedialog"
          >
            <template v-slot:default="dialog">
              <v-card>
                <v-toolbar color="primary" dark>{{showLanguage('Message_title')}}</v-toolbar>
                <v-card-text>
                  <div class="text-h5 pa-12">
                    {{showLanguage('Message_looking')}}                
                  </div>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn text @click="dialog.value = false">{{showLanguage('Close')}}</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </div>

        <v-spacer></v-spacer>
        <v-btn elevation="2" text @click="navtoPost()">
          <span class="mr-2">{{showLanguage('Post_free')}}</span>
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <div v-if="getUser === '{}'" class="d-flex align-center">
          <v-btn href="/loginclient" elevation="2" text>
            <span class="mr-2">{{showLanguage('Login')}}</span>
            <v-icon>mdi-account-check</v-icon>
          </v-btn>
          <v-btn href="/registerclient" elevation="2" text>
            <span class="mr-2">{{showLanguage('Register')}}</span>
            <v-icon>mdi-account-key</v-icon>
          </v-btn>
        </div>
        <div v-else>
          <div class="d-flex align-center text-center">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <span class="mr-2">{{ getUser.email }}</span>
                <v-icon
                  size="32"
                  color="blue-grey darken-2"
                  v-bind="attrs"
                  v-on="on"
                  >mdi-account-reactivate</v-icon
                >
              </template>
              <v-list width="300" dense dark>
                <v-list-item link>
                  <v-dialog v-model="dialog" width="700">
                    <template v-slot:activator="{ on, attrs }">
                      <v-list-item-title
                        v-bind="attrs"
                        v-on="on"
                        @click="manageProfile()"
                        >{{showLanguage('ManageProfile')}}</v-list-item-title
                      >
                    </template>

                    <v-card>
                      <v-card-title class="headline grey lighten-2">
                        {{showLanguage('ManageProfile')}}
                      </v-card-title>

                      <ValidationObserver ref="observer" v-slot="{ invalid }">
                        <v-card-text>
                          <v-container>
                            <v-form
                              @submit.prevent="submit"
                              lazy-validation
                            >
                              <v-row>
                                <v-col cols="12" sm="6" md="6">
                                  <ValidationProvider
                                    name="Name"
                                    rules="required"
                                    v-slot="{ errors }"
                                  >
                                    <v-text-field
                                      v-model="user.name"
                                      :label="`${showLanguage('Username')}`"
                                      :error-messages="errors"
                                      outlined
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
                                      v-model="user.email"
                                      :label="`${showLanguage('Useremail')}`"
                                      :error-messages="errors"
                                      outlined
                                      required
                                    >
                                    </v-text-field>
                                  </ValidationProvider>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                  <ValidationProvider
                                    name="Password"
                                    rules="required|min:6"
                                    v-slot="{ errors }"
                                  >
                                    <v-text-field
                                      :type="'password'"
                                      :label="`${showLanguage('Password')}`"
                                      :error-messages="errors"
                                      v-model="user.password"
                                      outlined
                                      required
                                    >
                                    </v-text-field>
                                  </ValidationProvider>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                  <ValidationProvider
                                    name="Confirm"
                                    rules="required|password:@Password"
                                    v-slot="{ errors }"
                                  >
                                    <v-text-field
                                      :type="'password'"
                                      :label="`${showLanguage('ConfirmPassword')}`"
                                      :error-messages="errors"
                                      outlined
                                      v-model="confirmPassword"
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
                          <v-btn
                            color="blue darken-1"
                            :disabled="invalid"
                            text
                            @click="save"
                          >
                            {{showLanguage('Save')}}
                          </v-btn>
                        </v-card-actions>
                      </ValidationObserver>
                    </v-card>
                  </v-dialog>

                  <v-list-item-icon
                    ><v-icon>mdi-account-settings</v-icon></v-list-item-icon
                  >
                </v-list-item>
                <v-list-item link>
                  <v-list-item-title @click="manageClientPost()"
                    >{{showLanguage('ManageClientPost')}}</v-list-item-title
                  >
                  <v-list-item-icon
                    ><v-icon>mdi-account-arrow-right</v-icon></v-list-item-icon
                  >
                </v-list-item>
                <v-list-item link>
                  <v-list-item-title @click="logout()"
                    >{{showLanguage('Logout')}}</v-list-item-title
                  >
                  <v-list-item-icon
                    ><v-icon>mdi-account-arrow-right</v-icon></v-list-item-icon
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </v-app-bar>

      <v-row no-gutters>
        <v-col cols="10" md="10" sm="8">
          <div v-if="getWaiting" class="pdiv">
            <v-progress-circular
              :size="70"
              :width="7"
              color="purple"
              indeterminate
            ></v-progress-circular>
          </div>
          <router-view v-else></router-view>
        </v-col>
        <v-col cols="2" md="2" sm="1">
          <v-card height="100%">
            <v-navigation-drawer class="mx-auto" permanent right>
              <v-divider></v-divider>

              <!-- <v-list dense>
                <v-list-item
                  link
                  v-for="item in items"
                  :key="item.name"
                  :to="item.path"
                >
                  <v-list-item-icon>
                    <v-icon>{{ item.meta.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{showLanguage(item.name)}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list> -->

              <v-system-bar
                height="50" dark color="red lighten-2"
              >
              <v-icon>mdi-home-search</v-icon>
              <span>Details Search Data</span>
              </v-system-bar>
              <v-col cols="12">
              <v-select
                  v-model="value"
                  :items="getAllCategorys"
                  item-text="title"
                  item-value="_id"
                  flat
                  solo-inverted
                  hide-details
                  return-object
              ></v-select>
              </v-col>
              <v-col cols="12">
              <v-text-field
                    :label="`${showLanguage('Title')}`"
                    flat
                    solo-inverted
                    hide-details
                    required
                  >
              </v-text-field>
              </v-col>
              <v-col cols="12">
              <v-text-field
                    :label="`${showLanguage('Description')}`"
                    flat
                    solo-inverted
                    hide-details
                    required
                  >
              </v-text-field>
              </v-col>
              <v-col cols="12">
              <v-text-field
                    :label="`${showLanguage('Phone')}`"
                    flat
                    solo-inverted
                    hide-details
                    required
                  >
              </v-text-field>
              </v-col>
              <v-col cols="12">
              <v-text-field
                    :label="`${showLanguage('Email')}`"
                    flat
                    solo-inverted
                    hide-details
                    required
                  >
              </v-text-field>
              </v-col>
              <v-col cols="12">
              <v-text-field
                    :label="`${showLanguage('Location')}`"
                    flat
                    solo-inverted
                    hide-details
                    required
                  >
              </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <v-col cols="5">
                    <v-text-field
                      :label="`${showLanguage('Price')}`"
                      flat
                      solo-inverted
                      hide-details
                      required
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="1">
                    <span>-</span>
                  </v-col>
                  <v-col cols="5">
                    <v-text-field
                      :label="`${showLanguage('Price')}`"
                      flat
                      solo-inverted
                      hide-details
                      required
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-btn large color="red lighten-2" block dark>
                  Search
                </v-btn>
              </v-col>
            </v-navigation-drawer>
          </v-card>
        </v-col>
      </v-row>
    </v-main>
    <v-dialog
      transition="dialog-bottom-transition"
      max-width="700"
      persistent
      v-model="info_dialog"
    >
    <v-card>
      <v-toolbar
        color="primary"
        dark
      >{{showLanguage('Message_title')}}</v-toolbar>
      <v-card-text>
        <div class="text-h5 pa-12">{{showLanguage('Message_post')}}</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          text
          @click="closedialog()"
        >{{showLanguage('Close')}}</v-btn>
      </v-card-actions>
    </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { extend } from "vee-validate";
import { required,email,min,max,numeric,double } from "vee-validate/dist/rules";

export default {
  name: "Home",
  components: {},
  data: () => ({
    items: [],
    value: { _id: "-1", title: "All" },
    user: {},
    dialog: false,
    info_dialog:false,
    confirmPassword: "",
    search: true,
    searchdata: null,
    messagedialog: false,

    direction: "right",
    fab: false,
    fling: false,
    hover: false,
    tabs: null,
    top: false,
    right: true,
    bottom: true,
    left: false,
    transition: "slide-y-reverse-transition",
  }),
  computed: {
    ...mapGetters([
      "getUser",
      "getMessage",
      "getAllCategorys",
      "allPosts",
      "getWaiting",
      "getLocalLang",
      "allLanguages"
    ]),
  },
  methods: {
    ...mapActions(["fetchUserClient", "fetchCategoriesLang", "fetchPostByCat","fetchLocalLanguage","fetchLanguages"]),
    manageProfile() {
      this.$store.commit("updateMessage", "");
      this.user = Object.assign({}, this.getUser);
    },
    async changeLanguage(langId){
      await this.fetchLocalLanguage(langId);
      let filter = {
        lang: langId,
        all: this.showLanguage('All')
      }
      this.fetchCategoriesLang(filter);
      localStorage.setItem('langId',langId);
      // await this.$refs.observer.reset();
      this.overideValidation();
    },
    showLanguage(prop){
      if(this.getLocalLang.length > 0){
        let propval = this.getLocalLang.filter(x=>x.props == prop);
        return (propval.length > 0) ? propval[0].text : 'Not Set';
      }
    },
    overideValidation(){
      extend("required", {
        ...required,
        message: this.showLanguage('VRequire')
      });

      extend("email", {
        ...email,
        message: this.showLanguage('VEmail')
      });

      extend("min", {
        ...min,
        message: this.showLanguage('VMin'),
      });

      extend("max", {
        ...max,
        message: this.showLanguage('VMax'),
      });

      extend("numeric", {
        ...numeric,
        message: this.showLanguage('VNumeric'),
      });

      extend("double", {
        ...double,
        message: this.showLanguage('VDouble'),
      });
    },
    logout() {
      localStorage.removeItem("clienttoken");
      this.$store.commit("setUser", "{}");
      this.$router.push('/welcome');
    },
    manageClientPost(){
      if(localStorage.getItem('clienttoken') != null){
        this.$router.push('/manageclientpost');
      }
      else {
        this.info_dialog = true;
      }
    },
    navtoPost(){
      if(localStorage.getItem('clienttoken') != null){
        this.$router.push('/post');
      }
      else {
        this.info_dialog = true;
      }
    },
    closedialog(){
      this.info_dialog = false;
    },
    save() {
      this.dialog = false;
      this.updateUser(this.user);
      this.$store.commit("updateMessage", "");
    },
    searchPost() {
      if (this.searchdata != null) {
        this.search = !this.search;
        let options = {
          itemsPerPage: 9,
          page: 1,
        };
        let pageObj = {
          searchObj: this.searchdata,
          categoryId: this.value._id,
          pageOpt: options,
        };

        //store vuex
        this.$store.commit("setSearchObj", pageObj);
        this.fetchPostByCat(pageObj);
      } else {
        this.messagedialog = true;
      }
    },
  },
  watch: {},
  async created() {
    if (localStorage.getItem("clienttoken") != null) {
      this.fetchUserClient();
    } else {
      this.$store.commit("setUser", "{}");
    }
    await this.fetchLanguages();
    let defaultlang = this.allLanguages.filter(x=>x.default == true)[0]._id;
    localStorage.setItem('langId',defaultlang);
    await this.fetchLocalLanguage(defaultlang);
    let filter = {
      lang: defaultlang,
      all: this.showLanguage('All')
    }
    await this.fetchCategoriesLang(filter);    
    this.overideValidation();
  },
  mounted() {
    this.$router.options.routes
      .filter((x) => x.name == "Home")
      .forEach((route) => {
        route.children
          .filter((x) => x.meta.back == true)
          .forEach((c) => {
            this.items.push(c);
          });
      });
  },
};
</script>
<style>
.pdiv {
  height: 100vh;
  line-height: 100vh;
  text-align: center;
  border: 1px dashed #f69c55;
}
</style>