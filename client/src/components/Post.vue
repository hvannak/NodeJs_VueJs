<template>
  <div>
    <v-stepper v-model="e1" non-linear>
      <v-stepper-header>
        <v-stepper-step
          :complete="e1 > 1"
          editable
          step="1"
        >
          Select Category
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step
          :complete="e1 > 2"
          editable
          step="2"
        >
          Input Information
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step
          step="3"
          editable
        >
          Submit Your Information
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
      <v-stepper-content step="1">
        <v-card height="80vh" class="mx-auto my-auto">
        <div class="d-flex justify-center flex-row flex-wrap">
          <div v-for="(item, i) in allCategorys"
            :key="i">
              <v-btn
                class="ma-2"
                outlined
                color="indigo"
                x-large
                @click="e1 = 2"
              >
                <v-icon x-large left>
                  {{item.icon}}
                </v-icon>
                {{item.title}}
              </v-btn>
          </div>
        </div>

        </v-card>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card height="100vh" class="mx-auto my-auto">

        <v-form
                ref="form"
                v-model="valid"
                lazy-validation>
                <v-row>
                  <v-col
                    cols="10" offset-md="1">
                    <v-text-field
                        v-model="post.category"
                        hint="You must input the category"
                        label="Your category"
                        persistent-hint
                        outlined
                        disabled
                        required>
                    </v-text-field>
                    </v-col>
                    <v-col
                    cols="10" offset-md="1">
                    <v-text-field
                        v-model="post.title"
                        hint="You must input the tittle"
                        label="Your tittle"
                        persistent-hint
                        outlined
                        required>
                    </v-text-field>
                    </v-col>
                    <v-col
                    cols="10" offset-md="1">
                    <v-textarea
                      v-model="post.description"
                      outlined
                      label="Your description"
                    ></v-textarea>
                    </v-col>
                    <v-col
                    cols="10" offset-md="1">
                    <v-text-field
                        v-model="post.phone"
                        hint="You must input the phone"
                        label="Your phone"
                        persistent-hint
                        outlined
                        required>
                    </v-text-field>
                    </v-col>
                    <v-col
                    cols="10" offset-md="1">
                    <v-text-field
                        v-model="post.email"
                        hint="You must input the email"
                        label="Your email"
                        persistent-hint
                        outlined
                        required>
                    </v-text-field>
                    </v-col>
                    <v-col
                    cols="10" offset-md="1">
                    <v-text-field
                        v-model="post.location"
                        hint="You must input the location"
                        label="Your location"
                        persistent-hint
                        outlined
                        required>
                    </v-text-field>
                    </v-col>
                    <v-col
                    cols="10" offset-md="1">
                    <v-file-input
                      label="File input"
                      outlined
                      prepend-icon="mdi-camera"
                    ></v-file-input>
                    </v-col>
                </v-row>
            </v-form>
        
        </v-card>

      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card
          class="mb-12"
          color="grey lighten-1"
          height="70vh"
        ></v-card>


      </v-stepper-content>
    </v-stepper-items>
    </v-stepper>   
  </div>
</template>
<script>
import { mapGetters,mapActions } from "vuex";

  export default {
    data: () => ({
        e1: 1,
        valid: true,
        post:{},
    }),
    computed: {
      ...mapGetters(["allCategorys", "getCategoryMessage"]),
    },
    methods:{
      ...mapActions(["fetchCategories"]),
    },
    created() {
      this.fetchCategories();    
  },
    
  }
</script>