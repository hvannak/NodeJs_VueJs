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

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn href="/login" target="_blank" text>
        <span class="mr-2">Control Panel</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

      <v-row no-gutters>
        <v-col cols="10" md="10" sm="8">
          <router-view></router-view>
        </v-col>
        <v-col cols="2" md="2" sm="1">
          <v-card height="92vh">
            <v-navigation-drawer class="mx-auto" permanent right>
              <template v-slot:prepend>
                <v-list-item two-line>
                  <v-list-item-avatar>
                    <!-- <img
                      src="https://randomuser.me/api/portraits/women/81.jpg"
                    /> -->
                    <v-icon x-large>mdi-account-cowboy-hat</v-icon>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>VANNAK HENG</v-list-item-title>
                    <v-list-item-subtitle>FOUNDER</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>

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

export default {
  name: "Home",
  components: {
  },
  data() {
    return {
      items: []
    };
  },
  mounted() {
    this.$router.options.routes
      .filter((x) => x.name == 'Home')
      .forEach((route) => {
        route.children
          .forEach((c) => {
            this.items.push(c);
          });
      });
  },
};
</script>
