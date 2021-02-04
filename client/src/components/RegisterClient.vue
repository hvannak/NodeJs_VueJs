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
  import { extend } from "vee-validate";
  import { required, email, min } from "vee-validate/dist/rules";

  extend("required", {
    ...required,
    message: "{_field_} can not be empty",
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
        if(this.getLocalLang.length > 0){
          let propval = this.getLocalLang.filter(x=>x.props == prop);
          return (propval.length > 0) ? propval[0].text : 'Not Set';
        }
      },
      reset () {
        this.$refs.form.reset()
      },
      register(){
        this.registerUser(this.user);
      }
    },
  }
</script>