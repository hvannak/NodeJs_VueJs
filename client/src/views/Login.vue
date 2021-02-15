<template>
  <v-app>
    <v-card width="60%" class="mx-auto my-auto">
      <v-system-bar>Application Autherization</v-system-bar>
      <v-alert v-if="getMessage != ''" outlined type="warning" text>
        {{ getMessage }}
      </v-alert>
      <v-main>
        <ValidationObserver ref="observer" v-slot="{ invalid }">
          <v-form lazy-validation>
            <v-row>
              <v-col cols="8" sm="12" offset="4" offset-sm="3">
                <v-col cols="6" sm="6">
                  <ValidationProvider
                    name="Email"
                    rules="required|email"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="user.email"
                      hint="You must input the valid email"
                      label="Your email"
                      :error-messages="errors"
                      persistent-hint
                      outlined
                      required
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>
                <v-col cols="6" sm="6">
                  <ValidationProvider
                    name="Password"
                    rules="required|min:6"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="user.password"
                      :type="'password'"
                      hint="Your must input 6 characters password"
                      label="Your password"
                      :error-messages="errors"
                      persistent-hint
                      outlined
                      required
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
                <v-col cols="6" sm="6">
                  <div class="d-flex justify-center">
                    <v-btn
                      :disabled="invalid"
                      color="success"
                      class="mr-4"
                      large
                      @click="login()"
                    >
                      LOGIN
                    </v-btn>
                    <v-btn color="success" class="mr-4" large @click="reset()">
                      RESET
                    </v-btn>
                  </div>
                </v-col>
              </v-col>
            </v-row>
          </v-form>
        </ValidationObserver>
      </v-main>
    </v-card>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { extend } from "vee-validate";
import { required,email,min,size } from "vee-validate/dist/rules";

extend("required", {
  ...required
});

extend("email", {
  ...email
});

extend("min", {
  ...min
});

extend("size", {
  ...size
});

extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
  message: 'Password confirmation does not match'
});

export default {
  data: () => ({
    user: {},
  }),

  computed: {
    ...mapGetters(["getMessage"]),
  },

  methods: {
    ...mapActions(["loginUser"]),
    async reset() {
      await this.$refs.observer.reset();
    },
    login() {
      this.loginUser(this.user);
    },
  },
};
</script>