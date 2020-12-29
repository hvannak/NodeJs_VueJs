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
        <v-card height="80vh">
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
        <v-card
          class="mb-12"
          color="grey lighten-1"
          height="70vh"
        ></v-card>


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