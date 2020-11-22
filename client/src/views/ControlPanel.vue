<template>
    <!-- App.vue -->
    <v-app>
    <v-navigation-drawer
    v-model="drawer" app>

    <v-card class="mx-auto" width="256" tile>
        <v-system-bar height="10"></v-system-bar>
        <v-list>
            <v-list-item>
            <v-list-item-avatar>
                <v-icon size="42" color="blue-grey darken-2">mdi-account-lock</v-icon>
            </v-list-item-avatar>
            </v-list-item>

            <v-list-item link>
            <v-list-item-content>
                <v-list-item-title class="title">
                {{user.name}}
                </v-list-item-title>
                <v-list-item-subtitle>{{user.email}}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
                <div class="text-center">
                    <v-menu top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon
                        v-bind="attrs"
                        v-on="on">mdi-menu-down</v-icon>
                    </template>

                    <v-list>
                        <v-list-item>
                            <v-row
                                align="center"
                                justify="space-around">
                                <v-btn
                                class="ma-2"
                                outlined
                                large
                                fab
                                color="indigo"
                                @click="logout()">
                                Logout
                                </v-btn>
                            </v-row>
                        </v-list-item>
                    </v-list>
                    </v-menu>
                </div>

            </v-list-item-action>
            </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list-group  
        v-for="(item, i) in itemGroups" :key="i">
            <template v-slot:activator>
                <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title v-text="item.group"></v-list-item-title>
                </v-list-item-content>
            </template>

            <v-list-item-group
                v-model="selectedItem"
                color="primary" class="ml-3">
                <v-list-item
                    v-for="(child, i) in itemChild.filter(x=>x.meta.group == item.group)"
                    :key="i">
                    <v-list-item-icon>
                    <v-icon v-text="child.meta.icon"></v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <router-link :to="item.path + '/' + child.path">
                            <v-list-item-title v-text="child.name" @click="showAppname(child.name)"></v-list-item-title>
                        </router-link>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list-group>

        
    </v-card>

    </v-navigation-drawer>

    <v-app-bar app>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>{{appname}}</v-toolbar-title>  
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
import axios from 'axios';
import jwt_decode from "jwt-decode";

  export default {
    data: () => ({
      selectedItem: 0,
      appname: '',
      drawer: true,
      user:{},
      items: [],
      itemChild:[],
      itemGroups:[]
    }),
    mounted () {
        this.$router.options.routes.filter(x=>x.meta.back == true).forEach(route => {
            route.children.filter(x=>x.meta.back == true).forEach(c => {
                this.itemChild.push(c);
                let index = this.itemGroups.findIndex(x=>x.group == c.meta.group);
                console.log(index);
                if(index == -1){
                    this.itemGroups.push({
                        name: c.name,
                        icon: c.meta.gicon,
                        path: route.path,
                        group: c.meta.group
                    })
                }
            })
        });
    },
    methods: {
        logout(){
            localStorage.removeItem('token');
            this.$router.push({name:'Login'});
        },
        showAppname(appname){
            this.appname = appname;
        }
    },
    created (){
        let token = localStorage.getItem('token');
        if(token != null){
            var decoded = jwt_decode(localStorage.getItem('token'));
            // let uri = process.env.MIX_APP_URL + ':' + process.env.MIX_APP_PORT + '/api/user/';
            const config = {
                headers: { 
                    // Authorization: 'Bearer ' + localStorage.getItem('token'),
                    'auth-token': token,
                    Accept: 'application/json'
                    }
            };
            axios.get('http://localhost:3000/api/user/' + decoded._id,config).then(res => {
                if(res.status == 200){
                    this.user = res.data;
                }
            }).catch(err => {
                console.log(err.response.data);
            })
        }
    }
  }
</script>