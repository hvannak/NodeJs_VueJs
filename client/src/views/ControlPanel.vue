<template>
    <!-- App.vue -->
    <v-app>
    <v-navigation-drawer app>

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
                <v-icon>mdi-menu-down</v-icon>
            </v-list-item-action>
            </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list
            nav
            dense>
            <v-list-item-group
            v-model="selectedItem"
            color="primary"
            >
            <v-list-item
                v-for="(item, i) in items"
                :key="i"
            >
                <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-card>

    </v-navigation-drawer>

    <v-app-bar app>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>   
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
      user:{},
      items: [
        { text: 'My Files', icon: 'mdi-folder' },
        { text: 'Shared with me', icon: 'mdi-account-multiple' },
        { text: 'Starred', icon: 'mdi-star' },
        { text: 'Recent', icon: 'mdi-history' },
        { text: 'Offline', icon: 'mdi-check-circle' },
        { text: 'Uploads', icon: 'mdi-upload' },
        { text: 'Backups', icon: 'mdi-cloud-upload' },
      ],
    }),
    created (){
        let token = localStorage.getItem('token');
        console.log(token);
        if(token != null){
            var decoded = jwt_decode(localStorage.getItem('token'));
            console.log(decoded);
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
                    console.log(res.data);
                    this.user = res.data;
                }
            }).catch(err => {
            console.log(err.response.data);
            })
        }
    }
  }
</script>