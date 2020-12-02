<template>
  <!-- App.vue -->
  <v-app>
    <v-navigation-drawer dark v-model="drawer" app>
      <v-card class="mx-auto" width="256" tile>
        <v-system-bar height="10"></v-system-bar>
        <v-toolbar>
            <v-toolbar-title>MODER CATTLE FARM</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-list-group v-for="(item, i) in itemGroups" :key="i">
          <template v-slot:activator>
            <v-divider vertical></v-divider>
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.group"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item-group
            v-model="selectedItem"
            color="primary"
            class="ml-3"
          >
            <v-list-item
              v-for="(child, i) in itemChild.filter(
                (x) => x.meta.group == item.group
              )"
              :key="i"
            >
            <v-divider vertical></v-divider>
              <v-list-item-icon>
                <v-icon v-text="child.meta.icon"></v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <router-link :to="item.path + '/' + child.path">
                  <v-list-item-title
                    v-text="child.name"
                    @click="showAppname(child.name)"
                  ></v-list-item-title>
                </router-link>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list-group>
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
              <v-list-item-title @click="logout()">Profile</v-list-item-title>
              <v-list-item-icon><v-icon>mdi-account-settings</v-icon></v-list-item-icon>
            </v-list-item>
            <v-list-item link>
              <v-list-item-title @click="logout()">Setting</v-list-item-title>
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
import axios from "axios";
import jwt_decode from "jwt-decode";

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
            console.log(index);
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
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push({ name: "Login" });
    },
    showAppname(appname) {
      this.appname = appname;
    },
  },
  created() {
    let token = localStorage.getItem("token");
    if (token != null) {
      var decoded = jwt_decode(localStorage.getItem("token"));
      // let uri = process.env.MIX_APP_URL + ':' + process.env.MIX_APP_PORT + '/api/user/';
      const config = {
        headers: {
          // Authorization: 'Bearer ' + localStorage.getItem('token'),
          "auth-token": token,
          Accept: "application/json",
        },
      };
      axios
        .get("http://localhost:3000/api/user/" + decoded._id, config)
        .then((res) => {
          if (res.status == 200) {
            this.user = res.data;
          }
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    }
  },
};
</script>