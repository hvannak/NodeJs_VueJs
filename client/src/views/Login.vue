<template>
    <v-app>
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
                        required
                    ></v-text-field>
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
    </v-app>
</template>

<script>
  import axios from 'axios';

  export default {
    data: () => ({
      valid: true,
      // password: '',
      // email: '',
      user:{},
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules:[
        v => !!v || 'Password is required',
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
      login(){
        if(this.validate()){
          axios.post('http://localhost:3000/api/user/login',this.user).then(res => {
            if(res.status == 200){
              this.$router.push({ name: 'ControlPanel'})
            }
        })
        }
      }
    },
  }
</script>