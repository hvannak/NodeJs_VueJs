<template>
<v-app>
  <v-main>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
      </div>

      <v-spacer></v-spacer>

      <div class="mx-auto mt-6">
      <v-form>
          <v-row>
            <v-col
              cols="6"
              md="6"
            >
              <v-select
                v-model="value"
                :items="selects"
                item-text="text"
                item-value="value"
                outlined
                dense
              ></v-select>
            </v-col>

            <v-col
              cols="6"
              md="6"
            >
              <v-text-field
                label="What are you looking for ?"
                required
                outlined
                dense
              ></v-text-field>
            </v-col>

          </v-row>
      </v-form>
      </div>

      <v-spacer></v-spacer>
      <div v-if="getUser === '{}'" class="d-flex align-center">
      <v-btn href="/loginclient" elevation="2" text>
        <span class="mr-2">LOG IN</span>
        <v-icon>mdi-account-check</v-icon>
      </v-btn>
      <v-btn href="/login" elevation="2" text>
        <span class="mr-2">REGISTER</span>
        <v-icon>mdi-account-key</v-icon>
      </v-btn>
      <v-btn href="/login" target="_blank" elevation="2" text>
        <span class="mr-2">POST FREE ADVERTISEMENT</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
      </div>
      <div v-else>
        <div class="text-center">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <span class="mr-2">{{getUser.email}}</span>
            <v-icon
              size="32"
              color="blue-grey darken-2"
              v-bind="attrs"
              v-on="on"
              >mdi-open-in-new</v-icon
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
                    >Manage Profile</v-list-item-title
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
              <v-list-item-title @click="logout()">Log out</v-list-item-title>
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
          <router-view></router-view>
        </v-col>
        <v-col cols="2" md="2" sm="1">
          <v-card height="92vh">
            <v-navigation-drawer class="mx-auto" permanent right>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item link v-for="item in items" :key="item.name" :to="item.path">
                  <v-list-item-icon>
                    <v-icon>{{ item.meta.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-navigation-drawer>
          </v-card>
        </v-col>
      </v-row>
  </v-main>
</v-app>
</template>

<script>
import { mapGetters,mapActions } from "vuex";
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
  name: "Home",
  components: {
  },
  data: () => ({
      items: [],
      value: { text: 'All', value: 'all' },
      user: {},
      selects: [
          { text: 'All', value: 'all' },
          { text: 'Others', value: 'others' }
        ],
      dialog: false,
      confirmPassword: "",
  }),
   computed: {
    ...mapGetters(["getUser","getIslogin", "getMessage"]),
  },
  methods:{
    ...mapActions(["fetchUser"]),
     manageProfile() {
      this.$store.commit("updateMessage", "");
      this.user = Object.assign({},this.getUser);
    },
    logout() {
      localStorage.removeItem("token");
      this.$store.commit("setUser","{}");
      console.log(this.getUser)
    },
    save() {
      this.dialog = false;
      this.updateUser(this.user);
      this.$store.commit("updateMessage", "");
    },
  },
  watch: {
    
  },
  created() {
    console.log(localStorage.getItem('token'));
    if(localStorage.getItem('token') != null){
      this.fetchUser();
    }
    else{
      this.$store.commit("setUser","{}");
    }
  },
  mounted() {
    this.$router.options.routes
      .filter((x) => x.name == 'Home')
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
