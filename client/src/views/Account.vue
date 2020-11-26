<template>
  <v-data-table
    :headers="headers"
    :items="allUsers"
    :search="search"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-divider class="mx-4" inset vertical> </v-divider>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        >
        </v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="70%">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="red lighten-2"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              New Item
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="headline grey lighten-2">
              <span class="headline">{{ formTitle }}</span>
              <v-spacer></v-spacer>
              <span class="headline font-weight-thin">{{ getMessage }}</span>
            </v-card-title>
            <ValidationObserver v-slot="{ invalid }">
              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid" lazy-validation>
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
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
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
        <v-dialog v-model="dialogDelete" max-width="50%">
          <v-card>
            <v-card-title class="headline"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="fetchUsers"> Reset </v-btn>
    </template>
  </v-data-table>
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
    valid: true,
    dialog: false,
    dialogDelete: false,
    search: "",
    confirmPassword: "",
    headers: [
      { text: "Name", value: "name" },
      { text: "Email", value: "email" },
      { text: "Date", value: "date" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    user: {},
    users: [],
    editedIndex: -1,
  }),
  computed: {
    ...mapGetters(["allUsers", "getMessage"]),
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {
    this.fetchUsers();
  },

  methods: {
    ...mapActions(["fetchUsers", "deleteUser", "addUser", "updateUser"]),

    editItem(item) {
      this.editedIndex = this.allUsers.indexOf(item);
      this.user = Object.assign(
        {},
        { _id: item._id, name: item.name, email: item.email }
      );
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.allUsers.indexOf(item);
      this.user = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteUser(this.user._id);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.user = Object.assign({}, {});
        this.editedIndex = -1;
      });
      this.$store.commit("updateMessage", "");
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.user = Object.assign({}, {});
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        this.updateUser(this.user);
      } else {
        this.addUser(this.user);
      }
    },
  },
};
</script>