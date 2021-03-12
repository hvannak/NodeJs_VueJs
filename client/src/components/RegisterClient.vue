<template>
    <v-app>
      <v-alert
        v-if="getMessage != ''"
        outlined
        type="success"
        text
      >
        {{ getMessage }}
      </v-alert>
      <v-card width="90%" class="mx-auto my-auto">
        <ValidationObserver v-slot="{ invalid }">
            <v-form
                ref="form"
                @submit.prevent="submit"
                lazy-validation>
                <v-row>
                    <v-col
                    cols="6" offset-md="3">
                    <ValidationProvider
                                name="Name"
                                rules="required"
                                v-slot="{ errors }"
                              >
                      <v-text-field
                          v-model="user.name"
                          :label="`${showLanguage('RUsername')}`"
                          :error-messages="errors"
                          persistent-hint
                          outlined
                          required>
                      </v-text-field>
                    </ValidationProvider>
                    </v-col>
                    <v-col
                    cols="6" offset-md="3">
                     <ValidationProvider
                                name="Email"
                                rules="required|email"
                                v-slot="{ errors }"
                              >
                    <v-text-field
                        v-model="user.email"
                        :label="`${showLanguage('REmail')}`"
                        :error-messages="errors"
                        persistent-hint
                        outlined
                        required>
                    </v-text-field>
                     </ValidationProvider>
                    </v-col>
                    <v-col
                    cols="6" offset-md="3">
                    <ValidationProvider
                                name="Password"
                                rules="required|min:6"
                                v-slot="{ errors }"
                              >
                    <v-text-field
                        v-model="user.password"
                        :type="'password'"
                        :label="`${showLanguage('RPassword')}`"
                        :error-messages="errors"
                        persistent-hint
                        outlined
                        required
                    ></v-text-field>
                    </ValidationProvider>
                    </v-col>
                    <v-col
                    cols="6" offset-md="3">
                    <div class="d-flex justify-center">
                        <v-btn
                        :disabled="invalid"
                        color="success"
                        class="mr-4" large
                        @click="register()"
                        >
                        {{showLanguage('BtnRegister')}}
                        </v-btn>
                    </div>

                    </v-col>
                </v-row>
            </v-form>
        </ValidationObserver>
      </v-card>
    </v-app>
</template>

<script>
  import { mapGetters, mapActions } from "vuex";
  import * as apiHelper from '../store/modules/api-helper';

  export default {
    data: () => ({
      user:{},
    }),
    computed: {
      ...mapGetters(["getMessage","getLocalLang"])
    },
    methods: {
      ...mapActions([
        "registerUser",
      ]),
      showLanguage(prop){
        return apiHelper.getShowLang(prop);
      },
      reset () {
        this.$refs.form.reset()
      },
      register(){
        this.user.backctl = false;
        this.registerUser(this.user);
      }
    },
  }
</script>