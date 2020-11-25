<template>
  <v-data-table
    :headers="headers"
    :items="allUsers"
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
          max-width="70%">
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
              <v-spacer></v-spacer>
              <span class="headline font-weight-thin">{{getMessage}}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form
                ref="form"
                v-model="valid"
                lazy-validation>

                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6">
                    <v-text-field
                      v-model="user.name"
                      :rules="nameRules"
                      label="Name">
                    </v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6">
                    <v-text-field
                      v-model="user.email"
                      :rules="emailRules"
                      label="Email">
                    </v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6">
                    <v-text-field
                      v-model="user.password"
                      :rules="passwordRules"
                      :type="'password'"
                      label="Password">
                    </v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6">
                    <v-text-field
                      v-model="confirmPassword"
                      :rules="confirmPasswordRules"
                      :type="'password'"
                      label="Confirm Password">
                    </v-text-field>
                  </v-col>
                </v-row>
                </v-form>
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
                :disabled="!valid"
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
        @click="fetchUsers">
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>
<script>
  import { mapGetters, mapActions  } from "vuex";

  export default {
    data: () => ({
      valid: true,
      dialog: false,
      dialogDelete: false,
      search: '',
      confirmPassword: '',
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Date', value: 'date' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      user:{},
      users: [],
      editedIndex: -1,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules:[
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must have 6+ characters'
      ],
      confirmPasswordRules:[
        v => !v || 'Confirm password is required'
      ],
      nameRules:[
        v => !!v || 'Name is required'
      ]
    }),
    computed:{
      ...mapGetters(["allUsers","getMessage"]),
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      }
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
      this.fetchUsers();
    },

    methods: {
      ...mapActions(["fetchUsers", "deleteUser","addUser", "updateUser"]),

      editItem (item) {
        this.editedIndex = this.allUsers.indexOf(item);
        this.user = Object.assign({},{_id:item._id,name:item.name,email:item.email});
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.allUsers.indexOf(item)
        this.user = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.deleteUser(this.user._id);
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.user = Object.assign({},{});
          this.editedIndex = -1
        });
        this.$store.commit("updateMessage",'');
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.user = Object.assign({},{});
          this.editedIndex = -1
        })
      },

      save () {
        if(this.editedIndex > -1){
          this.updateUser(this.user);
        } else {
          this.addUser(this.user);
        }    
      },
    },
  }
</script>