<template>
    <v-app>
      <v-card width="90%" class="mx-auto my-auto">
        <v-alert
          v-if="getMessage != ''"
          outlined
          type="warning"
          text
        >
          {{ getMessage }}
        </v-alert>
        <v-main>
            <v-form
                ref="form"
                v-model="valid"
                lazy-validation>
                <v-row>
                <v-col cols="8" sm="12" offset="4" offset-sm="3">
                    <v-col
                    cols="6"
                    sm="6">
                    <v-text-field
                        v-model="user.email"
                        :rules="emailRules"
                        hint="You must input the valid email"
                        label="Your email"
                        persistent-hint
                        outlined
                        required>
                    </v-text-field>
                    </v-col>
                    <v-col
                    cols="6"
                    sm="6">
                    <v-text-field
                        v-model="user.password"
                        :rules="passwordRules"
                        :type="'password'"
                        hint="Your must input 6 characters password"
                        label="Your password"
                        persistent-hint
                        outlined
                        required
                    ></v-text-field>
                    </v-col>
                    <v-col
                    cols="6"
                    sm="6">
                    <div class="d-flex justify-center">
                        <v-btn
                        :disabled="!valid"
                        color="success"
                        class="mr-4" large
                        @click="login()"
                        >
                        LOGIN
                        </v-btn>
                    </div>

                    </v-col>
                </v-col>
                </v-row>
            </v-form>
        </v-main>
      </v-card>        
    </v-app>
</template>

<script>
  import { mapGetters, mapActions } from "vuex";

  export default {
    data: () => ({
      valid: true,
      user:{},
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules:[
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must have 6+ characters'
      ]
    }),

    computed: {
      ...mapGetters(["getMessage"])
    },

    methods: {
      ...mapActions([
        "loginUserClient"
      ]),
      validate () {
        return this.$refs.form.validate()
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },
      login(){
        if(this.validate()){
          this.loginUserClient(this.user);
        }
      }
    },
  }
</script>