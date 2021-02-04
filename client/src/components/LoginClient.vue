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
          <ValidationObserver v-slot="{ invalid }">
            <v-form
                ref="form"
                lazy-validation>
                <v-row>
                <v-col cols="8" sm="12" offset="4" offset-sm="3">
                    <v-col
                    cols="6"
                    sm="6">
                    <ValidationProvider
                                name="Email"
                                rules="required|email"
                                v-slot="{ errors }"
                              >
                    <v-text-field
                        v-model="user.email"
                        :label="`${showLanguage('CEmail')}`"
                        :error-messages="errors"
                        persistent-hint
                        outlined
                        required>
                    </v-text-field>
                    </ValidationProvider>
                    </v-col>
                    <v-col
                    cols="6"
                    sm="6">
                    <ValidationProvider
                                name="Password"
                                rules="required|min:6"
                                v-slot="{ errors }"
                              >
                    <v-text-field
                        v-model="user.password"
                        :type="'password'"
                        :label="`${showLanguage('CPassword')}`"
                        :error-messages="errors"
                        persistent-hint
                        outlined
                        required
                    ></v-text-field>
                    </ValidationProvider>
                    </v-col>
                    <v-col
                    cols="6"
                    sm="6">
                    <div class="d-flex justify-center">
                        <v-btn
                        :disabled="invalid"
                        color="success"
                        class="mr-4" large
                        @click="login()"
                        >
                        {{showLanguage('BtnLogin')}}
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

  export default {
    data: () => ({
      user:{},
    }),

    computed: {
      ...mapGetters(["getMessage","getLocalLang"])
    },

    methods: {
      ...mapActions([
        "loginUserClient",
      ]),
      showLanguage(prop){
        if(this.getLocalLang.length > 0){
          let propval = this.getLocalLang.filter(x=>x.props == prop);
          return (propval.length > 0) ? propval[0].text : 'Not Set';
        }
      },
      login(){
        this.loginUserClient(this.user);
      }
    },
  }
</script>