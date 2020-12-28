<template>
    <v-app>
      <v-card width="90%" class="mx-auto my-auto">
            <v-form
                ref="form"
                v-model="valid"
                lazy-validation>
                <v-row>
                    <v-col
                    cols="6" offset-md="3">
                    <v-text-field
                        v-model="user.name"
                        :rules="nameRules"
                        hint="You must input the name"
                        label="Your name"
                        persistent-hint
                        outlined
                        required>
                    </v-text-field>
                    </v-col>
                    <v-col
                    cols="6" offset-md="3">
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
                    cols="6" offset-md="3">
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
                    cols="6" offset-md="3">
                    <div class="d-flex justify-center">
                        <v-btn
                        :disabled="!valid"
                        color="success"
                        class="mr-4" large
                        @click="register()"
                        >
                        Register
                        </v-btn>
                    </div>

                    </v-col>
                </v-row>
            </v-form>
      </v-card>
        <div class="text-center ma-2">
        <v-snackbar
          v-model="snackbar">
          {{ snakbartext }}
          <template v-slot:action="{ attrs }">
            <v-btn
              color="pink"
              text
              v-bind="attrs"
              @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </div>

    </v-app>
</template>

<script>
  import axios from 'axios';

  export default {
    data: () => ({
      valid: true,
      user:{},
      snackbar: false,
      snakbartext: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules:[
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must have 6+ characters'
      ],
      nameRules:[
        v => !!v || 'Name is required'
      ]
    }),

    methods: {
      validate () {
        return this.$refs.form.validate()
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },
      register(){
        if(this.validate()){
          axios.post('http://localhost:3000/api/user/register',this.user).then(res => {
            if(res.status == 200){
              console.log(res.data);
              this.snackbar = true;
              this.snakbartext = res.data.message;
              this.reset();
            }
        }).catch(err => {
          console.log(err.response.data);
          this.snackbar = true;
          this.snakbartext = err.response.data;
        })
        }
      }
    },
  }
</script>