<template>
  <!-- App.vue -->
  <v-app>
    <v-navigation-drawer dark v-model="drawer" app>
      <v-card class="mx-auto" width="256" tile>
        <v-system-bar height="10"></v-system-bar>
        <v-toolbar>
          <v-toolbar-title>AGRI-FAMILY CO.,LTD</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-expansion-panels>
          <v-expansion-panel v-for="(item, i) in itemGroups" :key="i">
            <v-expansion-panel-header>{{
              item.group
            }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row
                justify="space-around"
                v-for="(child, i) in itemChild.filter(
                  (x) => x.meta.group == item.group
                )"
                :key="i"
              >
                <v-btn
                  dark
                  large
                  outlined
                  width="255"
                  class="justify-start ma-1"
                  :to="item.path + '/' + child.path"
                  @click="showAppname(child.name)"
                >
                  <v-icon left>
                    {{ child.meta.icon }}
                  </v-icon>
                  {{ child.name }}
                </v-btn>
              </v-row>
              <v-divider></v-divider>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ appname }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <div class="text-center">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              size="32"
              color="blue-grey darken-2"
              v-bind="attrs"
              v-on="on"
              >mdi-account-lock</v-icon
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
                    >{{ getUser.email }}</v-list-item-title
                  >
                </template>

                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    Manage Profile
                  </v-card-title>

                  <ValidationObserver v-slot="{ invalid }">
                    <v-card-text>
                      <v-container>
                        <v-form
                          @submit.prevent="submit"
                          ref="form"
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
                                  label="Name"
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
                                  v-model="user.email"
                                  label="Email"
                                  :error-messages="errors"
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
                                  label="Password"
                                  :error-messages="errors"
                                  v-model="user.password"
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
                                  label="Confirm Password"
                                  :error-messages="errors"
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
                        Save
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
              <v-list-item-title @click="manageSetting()"
                >Setting</v-list-item-title
              >
              <v-list-item-icon
                ><v-icon>mdi-cog-transfer</v-icon></v-list-item-icon
              >
            </v-list-item>
            <v-list-item link>
              <v-list-item-title @click="logout()">Log out</v-list-item-title>
              <v-list-item-icon
                ><v-icon>mdi-account-arrow-right</v-icon></v-list-item-icon
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app light padless>
      <v-divider></v-divider>
      {{ new Date().getFullYear() }} — <strong>AGRI FAMILY CO.LTD</strong>
      <v-divider></v-divider>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { extend } from "vee-validate";
import { required, email, min } from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

extend("password", {
  params: ["target"],
  validate(value, { target }) {
    return value === target;
  },
  message: "Password confirmation does not match",
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
    selectedItem: 0,
    appname: "",
    drawer: true,
    user: {},
    items: [],
    itemChild: [],
    itemGroups: [],
    dialog: false,
    confirmPassword: "",
  }),
  mounted() {
    this.$router.options.routes
      .filter((x) => x.meta.back == true && x.name == 'ControlPanel')
      .forEach((route) => {
        route.children
          .filter((x) => x.meta.back == true)
          .forEach((c) => {
            this.itemChild.push(c);
            let index = this.itemGroups.findIndex(
              (x) => x.group == c.meta.group
            );
            if (index == -1) {
              this.itemGroups.push({
                name: c.name,
                icon: c.meta.gicon,
                path: route.path,
                group: c.meta.group,
              });
            }
          });
      });
  },
  watch: {

  },
  computed: {
    ...mapGetters(["getUser", "getMessage"]),
  },
  created() {
    this.fetchUser();
  },
  methods: {
    ...mapActions(["fetchUser", "updateUser"]),
    manageProfile() {
      this.$store.commit("updateMessage", "");
      this.user = Object.assign({},this.getUser);
    },
    manageSetting() {
      console.log("manage user setting");
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push({ name: "Login" });
    },
    showAppname(appname) {
      this.appname = appname;
    },
    save() {
      this.dialog = false;
      this.updateUser(this.user);
      this.$store.commit("updateMessage", "");
    },
  },
};
</script>