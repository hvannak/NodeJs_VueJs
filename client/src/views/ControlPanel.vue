<template>
  <!-- App.vue -->
  <v-app>
    <v-navigation-drawer dark v-model="drawer" app>
      <v-card class="mx-auto" width="256" tile>
        <v-system-bar height="10"></v-system-bar>
        <v-toolbar>
            <v-toolbar-title>MODERN CATTLE FARM</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-expansion-panels>
          <v-expansion-panel
            v-for="(item,i) in itemGroups"
            :key="i"
          >
            <v-expansion-panel-header>{{item.group}}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row
                justify="space-around"
                v-for="(child, i) in itemChild.filter(
                (x) => x.meta.group == item.group)"
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
                    {{child.meta.icon}}
                  </v-icon>
                  {{child.name}}
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
              <v-list-item-title @click="manageProfile()">{{getUser.email}}</v-list-item-title>
              <v-list-item-icon><v-icon>mdi-account-settings</v-icon></v-list-item-icon>
            </v-list-item>
            <v-list-item link>
              <v-list-item-title @click="manageSetting()">Setting</v-list-item-title>
              <v-list-item-icon><v-icon>mdi-cog-transfer</v-icon></v-list-item-icon>
            </v-list-item>
            <v-list-item link>
              <v-list-item-title @click="logout()">Log out</v-list-item-title>
              <v-list-item-icon><v-icon>mdi-account-arrow-right</v-icon></v-list-item-icon>
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

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data: () => ({
    selectedItem: 0,
    appname: "",
    drawer: true,
    user: {},
    items: [],
    itemChild: [],
    itemGroups: [],
  }),
  mounted() {
    this.$router.options.routes
      .filter((x) => x.meta.back == true)
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
  computed: {
    ...mapGetters(["getUser", "getMessage"])
  },
  created() {
    this.fetchUser();
  },
  methods: {
    ...mapActions([
      "fetchUser"
    ]),
    manageProfile(){
      console.log('manage user profile');
    },
    manageSetting(){
      console.log('manage user setting');
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push({ name: "Login" });
    },
    showAppname(appname) {
      this.appname = appname;
    },
  }
};
</script>