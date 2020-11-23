<template>
  <v-data-table
    :headers="headers"
    :items="users"
    :search="search"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat>
        <v-divider
          class="mx-4"
          inset
          vertical>
        </v-divider>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details>
        </v-text-field>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="90%">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="red lighten-2"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on">
              New Item
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="headline grey lighten-2">
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4">
                    <v-text-field
                      v-model="user.name"
                      label="Name">
                    </v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4">
                    <v-text-field
                      v-model="user.email"
                      label="Email">
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close">
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="50%">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize">
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>
<script>
  import axios from 'axios';
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      search: '',
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Date', value: 'date' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      user:{},
      users: [],
      editedIndex: -1
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        let token = localStorage.getItem('token');
        if(token != null){
          const config = {
            headers: { 
                'auth-token': token,
                Accept: 'application/json'
              }
          };
          axios.get('http://localhost:3000/api/user',config).then(res => {
              if(res.status == 200){
                this.users = res.data;
              }
          }).catch(err => {
            console.log(err.response.data);
          })
        }
      },

      editItem (item) {
        this.editedIndex = this.users.indexOf(item);
        this.user = Object.assign({},item);
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.user = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.users.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.user = Object.assign({},{});
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.user = Object.assign({},{});
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.users[this.editedIndex], this.user)
        } else {
          this.users.push(this.user)
        }
        this.close()
      },
    },
  }
</script>