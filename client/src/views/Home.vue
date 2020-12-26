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

      <div v-if="checklogin" class="d-flex align-center">

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
        <v-icon>mdi-open-in-new</v-icon>
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
import { mapGetters } from "vuex";

export default {
  name: "Home",
  components: {
  },
  data: () => ({
      items: [],
      value: { text: 'All', value: 'all' },
      selects: [
          { text: 'All', value: 'all' },
          { text: 'Others', value: 'others' }
        ],
      login: false
  }),
   computed: {
    ...mapGetters(["getUser", "getMessage"]),
  },
  methods:{
    checklogin(){
      return this.getUser != null ? false : true;
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
